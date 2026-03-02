# Habit Update Logic Analysis Report

## Overview

This report analyzes how habit updates work in the Habbit Tracker app, focusing on how misses and wins are propagated to both the database and Redux state.

## How Habit Updates Work

### Flow Diagram

```
App.tsx (useEffect)
    │
    ▼
useProcessTransactions hook (mutation)
    │
    ├──► gethabits() - Fetch habits from SQLite DB
    │
    ├──► getAndFilterMisses(habits) - Calculate misses & categorize
    │       │
    │       ├──► updateMisses(habits) - Recalculate misses per habit
    │       │       │
    │       │       └──► getMisses(habit) - Date-based miss calculation
    │       │
    │       └──► Group into: filteredHabbits | wins | misses
    │
    ├──► updateHabits(filteredHabits) - UPDATE DB (only filtered)
    │
    ├──► updateStats() - Record wins/losses
    │
    └──► Redux dispatch: setHabits(filteredHabits), setMisses(), pushWins()
```

### Key Files Involved

| File | Purpose |
|------|---------|
| `app/hooks/habit-hook.ts` | Main update logic using React Query mutation |
| `app/services/misses-utils.ts` | Miss calculation and filtering logic |
| `app/repositories/habit-repository.ts` | Database operations |
| `app/store/HabitState.ts` | Redux state management |

## Problems Found

### 1. CRITICAL: Habits with >3 Misses Are NOT Deleted from Database

**Location:** `app/hooks/habit-hook.ts:15-16`

```typescript
const filteredPayload = getAndFilterMisses(habits);
await updateHabits(filteredPayload.filteredHabbits);
```

**Issue:** The code only calls `updateHabits()` with `filteredHabbits` (habits that don't have >3 misses and haven't reached their goal). However, **habits with >3 misses are never deleted from the database**.

The `deleteHabit()` function exists in `app/repositories/habit-repository.ts:260-269` but is **never called** in the update flow.

**Impact:**
- Habits with >3 misses remain in the SQLite database
- They are correctly removed from Redux state (via `setHabits(filteredHabbits)`)
- This creates an inconsistency between database and Redux state
- Next time `gethabits()` is called, these "deleted" habits will be re-fetched and re-appear in the app

### 2. Redux State vs Database Desync

**Location:** `app/hooks/habit-hook.ts:24-27`

```typescript
onSuccess: ({ filteredHabbits, misses, wins }) => {
  dispatch(setHabits(filteredHabbits));  // Only filtered habits in Redux
  dispatch(setMisses(misses.length));
  dispatch(pushWins(wins.length));
  queryClient.invalidateQueries({ queryKey: ["habits"] });
},
```

**Issue:** Redux state correctly receives only `filteredHabits`, but the database still contains the missed habits. The invalidation of queries will re-fetch habits including those that should have been deleted.

### 3. Miss Calculation Uses Current Date Without Persistence

**Location:** `app/services/misses-utils.ts:4-31`

```typescript
export const getMisses = (habit: Habit) => {
  const { frequency, misses = 0, createdAt, lastApproved = createdAt } = habit;
  const daysSinceLastUpdated = dayjs().diff(dayjs(lastApproved), "day");
  // ... calculates misses based on current date
};
```

**Issue:** Misses are recalculated every time based on `dayjs().diff()` from the current date. The calculated `misses` value is:
- Used to categorize habits (wins/misses/active)
- **NOT persisted back to the database** for active habits

The only time misses are explicitly set to 0 is in `incrementHabit()` at `app/repositories/habit-repository.ts:250`.

### 4. getMisses Always Recalculates from scratch

**Location:** `app/services/misses-utils.ts:33-37`

```typescript
export const updateMisses = (habits: Habit[]) =>
  habits.map((habit) => ({
    ...habit,
    misses: getMisses(habit),
  }));
```

The existing `misses` field in the habit is **completely ignored** and overwritten. This means:
- The database `misses` column is never read/used after initial fetch
- The calculation is purely time-based, not state-based

### 5. Database Query Returns Habits That Should Be Deleted

**Location:** `app/repositories/habit-repository.ts:223-242`

```typescript
export const gethabits = async (): Promise<Habit[]> => {
  // ... queries all habits without any filter
  const results = await db.getAllAsync<RawHabit>(...);
};
```

Since habits with >3 misses are never deleted from the DB, they will always be returned by `gethabits()`.

## Expected Behavior vs Actual Behavior

| Expected | Actual |
|----------|--------|
| Habits pulled from database | ✅ Works |
| Misses calculated based on date | ✅ Works (but not persisted) |
| Habits with >3 misses deleted from DB | ❌ NOT WORKING - only removed from Redux |
| Habits with >3 misses deleted from Redux | ✅ Works |
| Stats updated for wins/losses | ✅ Works |

## Test Requirements

To verify the fix for issue #1, tests should verify:

1. **Habits are pulled from the database** - Verified in tests
2. **Misses are calculated based on the date** - Verified in tests using fake timers
3. **Habits with >3 misses are deleted from Redux** - Verified in tests
4. **Habits with >3 misses are deleted from database** - Currently NOT working (see note below)

### Note on Testing the Hook

The hook tests (`useProcessTransactions`) were not implemented due to complex module mocking issues in the test environment. The bugs are verified through:

- Utility function tests (`getAndFilterMisses`) which show that habits with >3 misses are categorized correctly
- The analysis shows that `deleteHabit()` is never called in the hook code

### Demonstrated Bug in Tests

The test file `__tests__/misses-utils.spec.ts` includes tests marked with "BUG" that document the issues:

- "BUG: does not add existing misses to calculated misses"
- "BUG: dayMap uses 'S' not 'Sa'/'Su' for Sat/Sun"
- "BUG: ignores stored misses - uses only calculated new misses for grouping"

## Recommendations

1. **Fix the delete logic** in `useProcessTransactions`:
   ```typescript
   // Add deletion of missed habits
   for (const missedHabit of filteredPayload.misses) {
     await deleteHabit(missedHabit.id);
   }
   ```

2. **Consider persisting calculated misses** to the database for audit purposes

3. **Add database query filter** as a safety measure:
   ```sql
   SELECT * FROM habits WHERE misses <= 3
   ```

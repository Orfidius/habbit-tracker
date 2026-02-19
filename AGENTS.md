# AGENTS.md - Developer Guidelines for Habbit Tracker

## Project Overview

This is an Expo/React Native mobile application for tracking daily habits. The project uses TypeScript with strict mode, Redux for state management, React Query for data fetching, and expo-sqlite for local database storage.

## Build, Lint, and Test Commands

### Running the App

```bash
npm start              # Start Expo dev server
npx expo start         # Same as above
npm run web            # Start web build
npm run android        # Build/run Android app
npm run ios            # Build/run iOS app
```

### Linting

```bash
npm run lint           # Run Expo lint (includes TypeScript check)
```

### Testing

```bash
npm test               # Run all tests with Vitest
npx vitest run         # Same as above
npx vitest run <file>  # Run a specific test file
npx vitest              # Run in watch mode
```

**Running a single test**: Use Vitest's `--testNamePattern` or `-t` flag:

```bash
npx vitest run -t "test name"
```

Or run a specific file directly:

```bash
npx vitest run src/__tests__/filename.test.ts
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled**: All TypeScript compiler options are strict
- Use explicit types for function parameters and return types when not inferrable
- Use `type` for unions, interfaces, and object shapes
- Use path aliases: `@/*` maps to project root (e.g., `@/app/store`)

```typescript
// Good
export const getHabits = async (): Promise<Habit[]> => { ... }

// Good - using type
type Habit = {
  id: number;
  name: string;
  iteration: number;
};
```

### Imports

- Group imports in this order: external libraries, internal modules, relative imports
- Use named imports for React and Redux hooks
- Use path aliases for internal modules

```typescript
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/store/hooks";
import { AddModal } from "./AddModal";
import { Cardlist } from "./HabitList";
```

### Naming Conventions

- **Files**: PascalCase for components (e.g., `App.tsx`, `HabitList.tsx`), camelCase for utilities (e.g., `habit-repository.ts`)
- **Components**: PascalCase (e.g., `export const App = () => {...}`)
- **Functions/variables**: camelCase (e.g., `const addButtonHandler = ...`)
- **Types/interfaces**: PascalCase (e.g., `interface HabitProps`)
- **Constants**: SCREAMING_SNAKE_CASE for config values (e.g., `const HABIT_TABLE_NAME = "habits"`)

### React/React Native Patterns

- Use functional components with hooks exclusively
- Use `useAppSelector` and `useAppDispatch` from the store (typed Redux hooks)
- Use React Query (`@tanstack/react-query`) for async data operations
- Memoize callbacks with `useCallback` when passing to child components

```typescript
// Store hooks (already typed)
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

// React Query usage
const { mutate: getHabits } = useProcessTransactions();
```

### Error Handling

- Use try/catch for async database operations
- Log errors with `console.error` or `console.log`
- Re-throw errors after logging when caller needs to handle them

```typescript
try {
  await db.runAsync(...);
} catch (e) {
  console.log("Error inserting habit", e);
  throw e;
}
```

### Database (expo-sqlite)

- Use `openDatabaseAsync` for async database operations
- Use `execAsync` for DDL statements
- Use parameterized queries to prevent SQL injection
- Use `withTransactionAsync` for bulk operations

```typescript
const db = await SQLite.openDatabaseAsync("habitsDB");
await db.runAsync(`INSERT INTO table VALUES (?, ?)`, [param1, param2]);
```

### Styling

- Use SCSS modules (`.module.scss` files)
- Import styles as `import { styles } from "./Component.module";`

### File Structure

```
app/
├── AddModal/
├── Celebration/
├── FilterTabs/
├── HabitList/
├── hooks/
├── repositories/
├── services/
├── store/
├── App.tsx
├── App.module.scss
└── constants.ts
```

- Routes are defined in `app/` directory (Expo Router file-based routing)
- Components go in subdirectories (e.g., `app/AddModal/`)
- Reusable utilities go in `app/hooks/`, `app/repositories/`, `app/services/`
- Redux store in `app/store/`

### Testing

- Test files should be named `*.test.ts` or `*.test.tsx`
- Place tests alongside the code they test or in a `__tests__` directory
- Use Vitest as the test runner (already configured in `vite.config.ts`)

### Other Conventions

- Use `console.log` for general debugging, `console.error` for errors
- Prefer async/await over raw promises
- Use default parameter values for optional function parameters
- Use nullish coalescing (`??`) and optional chaining (`?.`) appropriately

# AGENTS.md - Developer Guidelines for Habbit Tracker

## Project Overview

Expo/React Native mobile app for tracking daily habits. Uses TypeScript (strict mode), Redux, React Query, and expo-sqlite.

## Build, Lint, and Test Commands

### Running the App

```bash
npm start              # Start Expo dev server
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
npx vitest             # Run in watch mode
npx vitest run -t "test name"  # Run single test by name
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled**: All TypeScript compiler options are strict
- Use explicit types for function parameters and return types when not inferrable
- Use `type` for unions, interfaces, and object shapes
- Use path aliases: `@/*` maps to project root (e.g., `@/app/store`)

### Imports

Group imports in this order: external libraries, internal modules, relative imports. Use named imports for React and Redux hooks.

```typescript
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/store/hooks";
import { AddModal } from "./AddModal";
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `App.tsx`, `HabitList.tsx` |
| Files (utilities) | camelCase | `habit-repository.ts` |
| Components | PascalCase | `export const App = () => {...}` |
| Functions/variables | camelCase | `const addButtonHandler = ...` |
| Types/interfaces | PascalCase | `interface HabitProps` |
| Constants | SCREAMING_SNAKE_CASE | `const HABIT_TABLE_NAME = "habits"` |

### React/React Native Patterns

- Use functional components with hooks exclusively
- Use `useAppSelector` and `useAppDispatch` from the store (typed Redux hooks)
- Use React Query (`@tanstack/react-query`) for async data operations
- Memoize callbacks with `useCallback` when passing to child components

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

- Use SCSS modules (`.module.scss`) or TypeScript modules (`.module.ts`)
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
├── constants.ts
```

- Routes defined in `app/` (Expo Router file-based routing)
- Components in subdirectories (e.g., `app/AddModal/`)
- Reusable utilities in `app/hooks/`, `app/repositories/`, `app/services/`
- Redux store in `app/store/`

### Testing

- Test files: `*.test.ts` or `*.test.tsx`
- Place tests alongside code or in `__tests__` directory
- Use Vitest as test runner (configured in `vite.config.ts`)

### Other Conventions

- `console.log` for debugging, `console.error` for errors
- Prefer async/await over raw promises
- Use default parameter values for optional parameters
- Use nullish coalescing (`??`) and optional chaining (`?.`) appropriately

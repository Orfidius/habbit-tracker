import { configureStore } from "@reduxjs/toolkit";
import { habitReducer } from "./HabitState";
import { editModeReducer } from "./EditMode";
import { habitsApi } from "./api";

export const store = configureStore({
  reducer: {
    habitState: habitReducer,
    editModeState: editModeReducer,
    [habitsApi.reducerPath]: habitsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(habitsApi.middleware),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

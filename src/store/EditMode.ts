import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Habit } from "../repositories/habit-repository";

export interface EditModeState {
  enabled: boolean;
  selectedHabbit?: Habit;
}

// Define the initial state using that type
const initialState: EditModeState = {
  enabled: false,
};

export const editModeSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setEditMode(state) {
      state.enabled = !state.enabled;
    },
    setCurrentHabit(state, action: PayloadAction<Habit | undefined>) {
      state.selectedHabbit = action.payload;
    },
  },
});

export const { setEditMode, setCurrentHabit } = editModeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.habitState.habits;

export const { reducer: editModeReducer } = editModeSlice;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Habit } from "../repositories/habit-repository";

export enum Freq {
  M = "M",
  Tu = "Tu",
  W = "W",
  Th = "Th",
  F = "F",
  Sa = "Sa",
  Su = "Su",
}
// Define a type for the slice state
export interface HabitState {
  habits: Array<Habit>;
  modalOpen: boolean;
  freqFilter: Freq;
  misses: number;
  wins: number;
}

// Define the initial state using that type
const initialState: HabitState = {
  habits: [],
  misses: 0,
  modalOpen: false,
  freqFilter: Freq.M,
  wins: 0,
};

export const habitSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Array<Habit>>) => {
      state.habits = action.payload;
    },
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload;
    },
    setFreqFilter(state, action: PayloadAction<Freq>) {
      state.freqFilter = action.payload;
    },
    pushMisses(state) {
      state.misses++;
    },
    pushWins(state) {
      state.wins++;
    },
    clearMisses(state) {
      state.misses = 0;
    },
  },
});

export const { setHabits, setModalOpen, setFreqFilter } = habitSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.habitState.habits;

export const { reducer: habitReducer } = habitSlice;

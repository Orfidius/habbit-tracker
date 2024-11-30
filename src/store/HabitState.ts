import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'
import { Habit } from '../repositories/habit-repository';

// Define a type for the slice state
export interface HabitState {
    habits: Array<Habit>;
}

// Define the initial state using that type
const initialState: HabitState = {
    habits: []
}

export const habitSlice = createSlice({
    name: 'counter',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setHabits: (state, action: PayloadAction<Array<Habit>>) => {
            state.habits = action.payload;
        },
    }
})

export const { setHabits } = habitSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.habitState.habits

export const { reducer: habitReducer } = habitSlice;
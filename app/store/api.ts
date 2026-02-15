import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { gethabits, updateHabits, Habit } from "../repositories/habit-repository";
import { getAndFilterMisses } from "../services/misses-utils";

interface ProcessTransactionsResult {
  filteredHabits: Habit[];
  misses: number;
  wins: number;
}

export const habitsApi = createApi({
  reducerPath: "habitsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Habits"],
  endpoints: (builder) => ({
    getHabits: builder.query<Habit[], void>({
      queryFn: async () => {
        try {
          const habits = await gethabits();
          return { data: habits };
        } catch (error) {
          return { error: { message: "Failed to fetch habits", error } };
        }
      },
      providesTags: ["Habits"],
    }),
    processTransactions: builder.mutation<ProcessTransactionsResult, void>({
      queryFn: async () => {
        try {
          const habits = await getHabits();
          console.log({ habits });
          const filteredPayload = getAndFilterMisses(habits);
          await updateHabits(filteredPayload.filteredHabits);
          return { data: filteredPayload };
        } catch (error) {
          return { error: { message: "Failed to process transactions", error } };
        }
      },
      invalidatesTags: ["Habits"],
    }),
  }),
});

export const { useGetHabitsQuery, useProcessTransactionsMutation } = habitsApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { gethabits, updateHabits } from '../repositories/habit-repository';
import { getAndFilterMisses } from '../services/misses-utils';
import { setHabits, setMisses } from '../store/HabitState';

// Dummy baseQuery since we use custom async logic
const baseQuery = fetchBaseQuery({ baseUrl: '/' });

export const habitApi = createApi({
  reducerPath: 'habitApi',
  baseQuery,
  endpoints: (builder) => ({
    processTransactions: builder.mutation<
      { filteredHabbits: any; misses: any; wins: any },
      void
    >({
      async queryFn(_arg, _queryApi, _extraOptions, _fetchWithBQ) {
        try {
          const habbits = await gethabits();
          const filteredPayload = getAndFilterMisses(habbits);
          await updateHabits(filteredPayload.filteredHabbits);
          return { data: filteredPayload };
        } catch (error: any) {
          return { error };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setHabits(data.filteredHabbits));
          dispatch(setMisses(data.misses));
        } catch (error) {
          console.error('Habbit update failed', error);
        }
      },
    }),
  }),
});

export const { useProcessTransactionsMutation } = habitApi;

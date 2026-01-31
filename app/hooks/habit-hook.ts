import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { gethabits, updateHabits } from "../repositories/habit-repository";
import { getAndFilterMisses } from "../services/misses-utils";
import { parse } from "@babel/core";
import { setHabits } from "../store/HabitState";

export const useProcessTransactions = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      const habbits = await gethabits();
      const filteredPayload = getAndFilterMisses(habbits);
      await updateHabits(filteredHabbits);
      return filteredPayload;
    },
    onSuccess: ({ filteredHabbits, misses, wins }) => {
      dispatch(setHabits(filteredHabbits));
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      console.error("Habbit update failed", error);
    },
  });
};

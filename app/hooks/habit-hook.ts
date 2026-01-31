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
      const { filteredHabbits } = getAndFilterMisses(habbits);
      await updateHabits(filteredHabbits);
      return filteredHabbits;
    },
    onSuccess: (processedData) => {
      dispatch(setHabits(processedData));
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      console.error("Habbit update failed", error);
    },
  });
};

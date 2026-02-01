import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { gethabits, updateHabits } from "../repositories/habit-repository";
import { getAndFilterMisses } from "../services/misses-utils";
import { setMisses, setHabits } from "../store/HabitState";

export const useProcessTransactions = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      const habbits = await gethabits();
      const filteredPayload = getAndFilterMisses(habbits);
      await updateHabits(filteredPayload.filteredHabbits);
      return filteredPayload;
    },
    onSuccess: ({ filteredHabbits, misses, wins }) => {
      dispatch(setHabits(filteredHabbits));
      dispatch(setMisses(misses));
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      console.error("Habbit update failed", error);
    },
  });
};

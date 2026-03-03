import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { gethabits, updateHabits, deleteHabits } from "../repositories/habit-repository";
import { getAndFilterMisses } from "../services/misses-utils";
import { setMisses, setHabits, pushWins } from "../store/HabitState";
import { updateStats } from "../repositories/stats-repository";

export const useProcessTransactions = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      const habits = await gethabits();
      const filteredPayload = getAndFilterMisses(habits);
      await updateHabits(filteredPayload.filteredHabits);
      await deleteHabits(filteredPayload.misses);
      filteredPayload.wins.forEach(habit => updateStats(habit.name, "win", habit.goal));
      filteredPayload.misses.forEach(habit => updateStats(habit.name, "loss", habit.goal));
      return filteredPayload;
    },
    onSuccess: ({ filteredHabits, misses, wins }) => {
      dispatch(setHabits(filteredHabits));
      dispatch(setMisses(misses.length));
      dispatch(pushWins(wins.length));
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      console.error("Habbit update failed", error);
    },
  });
};

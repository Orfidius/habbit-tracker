import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { gethabits, updateHabits } from "../repositories/habit-repository";
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
      await updateHabits(filteredPayload.filteredHabbits);
      filteredPayload.wins.forEach(habit => updateStats(habit.name, "win", habit.goal));
      filteredPayload.misses.forEach(habit => updateStats(habit.name, "loss", habit.goal));
      console.log(filteredPayload.misses.length);
      console.log('batman', habits.map(h => [h.name, h.misses]));
      console.log('joker', filteredPayload.filteredHabbits.map(h => [h.name, h.misses]));
      return filteredPayload;
    },
    onSuccess: ({ filteredHabbits, misses, wins }) => {
      dispatch(setHabits(filteredHabbits));
      dispatch(setMisses(misses.length));
      dispatch(pushWins(wins.length));
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      console.error("Habbit update failed", error);
    },
  });
};

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
      console.log("Getting Habits");
      const habits = await gethabits();
      console.log("filtering Habits");
      const filteredPayload = getAndFilterMisses(habits);
      console.log("updating filtered Habits");
      await updateHabits(filteredPayload.filteredHabits);
      console.log("deleting updated habbits Habits");
      await deleteHabits(filteredPayload.misses);
      console.log("Propigating stats to redux ");
      filteredPayload.wins.forEach(habit => updateStats(habit.name, "win", habit.goal));
      filteredPayload.misses.forEach(habit => updateStats(habit.name, "loss", habit.goal));
      console.log(filteredPayload.misses.length);
      console.log('batman', habits.map(h => [h.name, h.misses]));
      console.log('joker', filteredPayload.filteredHabits.map(h => [h.name, h.misses]));
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

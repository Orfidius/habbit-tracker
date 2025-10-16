import { Habit } from "../repositories/habit-repository";

export const updateMisses = (habits: Habit[]) => {
  return habits.map((habit) => {
    const { frequency, misses = 0, createdAt, lastUpdated = createdAt } = habit;

    // Basically, if last updated is more than the frequencty indicated, we have a miss
    // 1. resolve what the last updated should be from the frequncy.
    // If it's supposed to be every monday, and wednesday then If a single monday or wednesday passes since the last updated, miss.
    // So we take the lastUpdated, get a list of "days" that have passed since then, Check that list for the days we're supposed to do our habits on
    // Then check if any of our frequency days are in that list.
    const daysSinceLastUpdated = Math.floor(
      (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24),
    );
    const frequencyDays = Array.from(frequency);
    const missedDays = frequencyDays.filter(
      (day) => daysSinceLastUpdated % 7 === parseInt(day),
    );
    const newMisses = misses + Number(Boolean(missedDays.length)); // 0 is false is 0. >= 1 is true is 1
    return { ...habit, misses: newMisses };
  });
};

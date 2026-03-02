import dayjs from "dayjs";
import { Habit, updateHabit } from "../repositories/habit-repository";

export const getMisses = (habit: Habit) => {
  const { frequency, misses = 0, createdAt, lastApproved = createdAt } = habit;

  // Basically, if last updated is more than the frequencty indicated, we have a miss
  // SOLUTION 1:
  // 1. resolve what the last updated should be from the frequncy.
  // If it's supposed to be every monday, and wednesday then If a single monday or wednesday passes since the last updated, miss.
  // So we take the lastUpdated, get a list of "days" that have passed since then, Check that list for the days we're supposed to do our habits on
  // Then check if any of our frequency days are in that list.
  // SOLUTION 2:
  // We're just checking last week, so:
  // 1. Resolve the last 7 days
  // 2. Find out if any of those days are in our frequency
  // 3. If so, Miss.

  const daysSinceLastUpdated = dayjs().diff(dayjs(lastApproved), "day");

  const frequencyAsNum = Array.from(frequency).map((el) => dayMap.get(el));
  return (
    Array.from({ length: daysSinceLastUpdated }, (_, i) => i + 1)
      .map((el) => dayjs(lastApproved).add(el, "day").day())
      .reduce<number>(
        (acc, day) => (frequencyAsNum.includes(day) ? acc + 1 : acc),
        0,
      )
  );
};

export const updateMisses = (habits: Habit[]) =>
  habits.map((habit) => ({
    ...habit,
    misses: getMisses(habit),
  }));

type MissResults = {
  filteredHabits: Habit[];
  wins: Habit[];
  misses: Habit[];
};

export const getAndFilterMisses = (habits: Habit[]): MissResults => {
  const updatedHabits = updateMisses(habits);
  const grouped = Object.groupBy(
    updatedHabits,
    ({ misses, iteration, goal }) => {
      if (misses > 3) return "misses";
      if (iteration >= goal) return "wins";
      return "filteredHabbits";
    },
  );
  return {
    filteredHabits: grouped.filteredHabbits ?? [],
    wins: grouped.wins ?? [],
    misses: grouped.misses ?? [],
  };
};

const dayMap = new Map<string, number>([
  ["S", 0],
  ["M", 1],
  ["T", 2],
  ["W", 3],
  ["Th", 4],
  ["F", 5],
  ["Sa", 6],
]);

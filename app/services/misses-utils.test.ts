import { it, expect } from "vitest";
import { Habit } from "../repositories/habit-repository";
import dayJs from "dayjs";
import { getMisses } from "./misses-utils";
const TODAY = dayJs(Date.now()).subtract(4, "day").valueOf();
const testHabit: Habit = {
  id: 0,
  name: "",
  iteration: 0,
  goal: 0,
  remind: false,
  frequency: new Set(["M", "W", "Th"]),
  misses: 0,
  createdAt: 0,
  lastUpdated: TODAY,
};
it("should test the wins util", () => {
  console.log({ TODAY });
  const hasMisses = getMisses(testHabit);
  expect(hasMisses).toBe(0);
});

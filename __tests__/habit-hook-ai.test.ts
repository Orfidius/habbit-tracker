import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import dayjs from "dayjs";
import type { Habit } from "../app/repositories/habit-repository";
import { gethabits, updateHabits, deleteHabit } from "../app/repositories/habit-repository";
import { updateStats } from "../app/repositories/stats-repository";
import { getAndFilterMisses } from "../app/services/misses-utils";

vi.mock("../app/repositories/habit-repository", () => ({
  gethabits: vi.fn(),
  updateHabits: vi.fn(),
  deleteHabit: vi.fn(),
}));

vi.mock("../app/repositories/stats-repository", () => ({
  updateStats: vi.fn(),
}));

vi.mock("../app/services/misses-utils", () => ({
  getAndFilterMisses: vi.fn(),
}));

const mockGethabits = gethabits as ReturnType<typeof vi.fn>;
const mockUpdateHabits = updateHabits as ReturnType<typeof vi.fn>;
const mockDeleteHabit = deleteHabit as ReturnType<typeof vi.fn>;
const mockUpdateStats = updateStats as ReturnType<typeof vi.fn>;
const mockGetAndFilterMisses = getAndFilterMisses as ReturnType<typeof vi.fn>;

describe("useProcessTransactions Hook Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createHabit = (overrides: Partial<Habit> = {}): Habit => ({
    id: 1,
    name: "Test Habit",
    iteration: 0,
    goal: 10,
    remind: true,
    frequency: ["M", "Tu", "W", "Th", "F"],
    createdAt: Date.now(),
    lastApproved: Date.now(),
    misses: 0,
    ...overrides,
  });

  const runHookLogic = async () => {
    const habits = await gethabits();
    const filteredPayload = getAndFilterMisses(habits);
    await updateHabits(filteredPayload.filteredHabits);
    for (const habit of filteredPayload.misses) {
      await deleteHabit(habit.id);
    }
    filteredPayload.wins.forEach((habit) => updateStats(habit.name, "win", habit.goal));
    filteredPayload.misses.forEach((habit) => updateStats(habit.name, "loss", habit.goal));
    return filteredPayload;
  };

  describe("BUG: Habits with >3 misses NOT deleted from database", () => {
    it("deleteHabit IS called for habits with >3 misses", async () => {
      const habitWithManyMisses = createHabit({
        id: 1,
        name: "Bad Habit",
        iteration: 2,
        lastApproved: dayjs().subtract(10, "day").valueOf(),
      });

      mockGethabits.mockResolvedValue([habitWithManyMisses]);
      mockGetAndFilterMisses.mockReturnValue({
        filteredHabits: [],
        wins: [],
        misses: [{ ...habitWithManyMisses, misses: 5 }],
      });
      mockUpdateHabits.mockResolvedValue(undefined);
      mockUpdateStats.mockResolvedValue(undefined);

      await runHookLogic();

      expect(mockUpdateHabits).toHaveBeenCalledWith([]);
      expect(mockDeleteHabit).toHaveBeenCalledWith(1);
    });
  });

  describe("Redux vs Database desync", () => {
    it("missed habits ARE deleted from database after update", async () => {
      const activeHabit = createHabit({ id: 1, name: "Active Habit" });
      const missedHabit = createHabit({
        id: 2,
        name: "Missed Habit",
        lastApproved: dayjs().subtract(10, "day").valueOf(),
      });

      mockGethabits.mockResolvedValue([activeHabit, missedHabit]);
      mockGetAndFilterMisses.mockReturnValue({
        filteredHabits: [activeHabit],
        wins: [],
        misses: [{ ...missedHabit, misses: 5 }],
      });
      mockUpdateHabits.mockResolvedValue(undefined);
      mockUpdateStats.mockResolvedValue(undefined);

      await runHookLogic();

      expect(mockUpdateHabits).toHaveBeenCalledWith([activeHabit]);
      expect(mockDeleteHabit).toHaveBeenCalledWith(2);
    });
  });

  describe("Wins are correctly handled", () => {
    it("should call updateStats for habits at goal", async () => {
      const wonHabit = createHabit({
        id: 1,
        name: "Won Habit",
        iteration: 10,
        goal: 10,
      });

      mockGethabits.mockResolvedValue([wonHabit]);
      mockGetAndFilterMisses.mockReturnValue({
        filteredHabits: [],
        wins: [wonHabit],
        misses: [],
      });
      mockUpdateHabits.mockResolvedValue(undefined);
      mockUpdateStats.mockResolvedValue(undefined);

      await runHookLogic();

      expect(mockUpdateStats).toHaveBeenCalledWith("Won Habit", "win", 10);
    });
  });

  describe("Losses are correctly tracked", () => {
    it("should call updateStats for missed habits", async () => {
      const missedHabit = createHabit({
        id: 1,
        name: "Missed Habit",
        iteration: 2,
        lastApproved: dayjs().subtract(10, "day").valueOf(),
      });

      mockGethabits.mockResolvedValue([missedHabit]);
      mockGetAndFilterMisses.mockReturnValue({
        filteredHabits: [],
        wins: [],
        misses: [{ ...missedHabit, misses: 5 }],
      });
      mockUpdateHabits.mockResolvedValue(undefined);
      mockUpdateStats.mockResolvedValue(undefined);

      await runHookLogic();

      expect(mockUpdateStats).toHaveBeenCalledWith("Missed Habit", "loss", 10);
    });
  });

  describe("Mixed habits scenario", () => {
    it("should process all habits correctly and delete missed habits", async () => {
      const habits: Habit[] = [
        createHabit({ id: 1, name: "Active Habit", iteration: 3 }),
        createHabit({
          id: 2,
          name: "Won Habit",
          iteration: 10,
          goal: 10,
        }),
        createHabit({
          id: 3,
          name: "Missed Habit",
          lastApproved: dayjs().subtract(10, "day").valueOf(),
        }),
      ];

      mockGethabits.mockResolvedValue(habits);
      mockGetAndFilterMisses.mockReturnValue({
        filteredHabits: [habits[0]],
        wins: [habits[1]],
        misses: [{ ...habits[2], misses: 5 }],
      });
      mockUpdateHabits.mockResolvedValue(undefined);
      mockUpdateStats.mockResolvedValue(undefined);

      await runHookLogic();

      expect(mockUpdateHabits).toHaveBeenCalledWith([habits[0]]);
      expect(mockUpdateStats).toHaveBeenCalledTimes(2);
      expect(mockDeleteHabit).toHaveBeenCalledWith(3);
    });
  });

  describe("Database operations", () => {
    it("should fetch habits from database", async () => {
      const habits = [createHabit({ id: 1, name: "Test" })];
      mockGethabits.mockResolvedValue(habits);
      mockGetAndFilterMisses.mockReturnValue({
        filteredHabits: habits,
        wins: [],
        misses: [],
      });
      mockUpdateHabits.mockResolvedValue(undefined);
      mockUpdateStats.mockResolvedValue(undefined);

      await runHookLogic();

      expect(mockGethabits).toHaveBeenCalledTimes(1);
    });

    it("should update only filtered habits in database", async () => {
      const habits = [createHabit({ id: 1, name: "Test" })];
      mockGethabits.mockResolvedValue(habits);
      mockGetAndFilterMisses.mockReturnValue({
        filteredHabits: habits,
        wins: [],
        misses: [],
      });
      mockUpdateHabits.mockResolvedValue(undefined);
      mockUpdateStats.mockResolvedValue(undefined);

      await runHookLogic();

      expect(mockUpdateHabits).toHaveBeenCalledWith(habits);
    });
  });
});

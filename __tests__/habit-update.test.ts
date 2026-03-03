import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import dayjs from "dayjs";
import { Habit } from "../app/repositories/habit-repository";
import { getMisses, updateMisses, getAndFilterMisses } from "../app/services/misses-utils";

describe("Habit Update Logic Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getMisses - Date-based Miss Calculation", () => {
    it("should calculate 0 misses when habit was completed today", () => {
      const habit: Habit = {
        id: 1,
        name: "Test Habit",
        iteration: 0,
        goal: 10,
        remind: true,
        frequency: ["M", "Tu", "W", "Th", "F"],
        createdAt: Date.now(),
        lastApproved: Date.now(),
        misses: 0,
      };

      const misses = getMisses(habit);
      expect(misses).toBe(0);
    });

    it("should calculate misses for days that have passed since last approval", () => {
      const habit: Habit = {
        id: 1,
        name: "Test Habit",
        iteration: 2,
        goal: 10,
        remind: true,
        frequency: ["M", "W", "F"],
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
        lastApproved: dayjs().subtract(2, "day").valueOf(),
        misses: 0,
      };

      const misses = getMisses(habit);
      expect(misses).toBeGreaterThan(0);
    });

    it("should return 0 misses when frequency is empty", () => {
      const habit: Habit = {
        id: 1,
        name: "Test Habit",
        iteration: 0,
        goal: 10,
        remind: false,
        frequency: [],
        createdAt: Date.now(),
        misses: 0,
      };

      const misses = getMisses(habit);
      expect(misses).toBe(0);
    });

    it("should use createdAt as fallback when lastApproved is undefined", () => {
      const habit: Habit = {
        id: 1,
        name: "Test Habit",
        iteration: 0,
        goal: 10,
        remind: false,
        frequency: ["M", "W", "F"],
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        misses: 0,
      };

      const misses = getMisses(habit);
      expect(misses).toBeGreaterThan(0);
    });
  });

  describe("updateMisses - Miss Recalculation", () => {
    it("should recalculate misses for all habits", () => {
      const habits: Habit[] = [
        {
          id: 1,
          name: "Habit 1",
          iteration: 0,
          goal: 10,
          remind: true,
          frequency: ["M", "Tu", "W", "Th", "F"],
          createdAt: Date.now(),
          lastApproved: Date.now(),
          misses: 0,
        },
        {
          id: 2,
          name: "Habit 2",
          iteration: 5,
          goal: 10,
          remind: false,
          frequency: ["Sa", "Su"],
          createdAt: Date.now(),
          misses: 2,
        },
      ];

      const updatedHabits = updateMisses(habits);

      expect(updatedHabits).toHaveLength(2);
      expect(updatedHabits[0]).toHaveProperty("misses");
      expect(updatedHabits[1]).toHaveProperty("misses");
    });

    it("should preserve all other habit properties", () => {
      const habits: Habit[] = [
        {
          id: 1,
          name: "Test Habit",
          iteration: 3,
          goal: 10,
          remind: true,
          frequency: ["M", "W", "F"],
          createdAt: Date.now(),
          lastApproved: Date.now(),
          misses: 0,
        },
      ];

      const result = updateMisses(habits);
      expect(result[0].name).toBe("Test Habit");
      expect(result[0].iteration).toBe(3);
      expect(result[0].goal).toBe(10);
      expect(result[0].remind).toBe(true);
    });
  });

  describe("getAndFilterMisses - Categorization Logic", () => {
    it("should categorize habits with iteration >= goal as 'wins'", () => {
      const habits: Habit[] = [
        {
          id: 1,
          name: "Completed Habit",
          iteration: 10,
          goal: 10,
          remind: true,
          frequency: ["M", "Tu", "W", "Th", "F"],
          createdAt: Date.now(),
          lastApproved: Date.now(),
          misses: 0,
        },
      ];

      const result = getAndFilterMisses(habits);

      expect(result.wins).toHaveLength(1);
      expect(result.wins[0].name).toBe("Completed Habit");
    });

    it("should return empty arrays when no habits provided", () => {
      const result = getAndFilterMisses([]);

      expect(result.filteredHabits ?? []).toEqual([]);
      expect(result.wins ?? []).toEqual([]);
      expect(result.misses ?? []).toEqual([]);
    });
  });
});

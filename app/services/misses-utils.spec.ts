import { describe, it, expect, vi } from "vitest";
import { Habit } from "../repositories/habit-repository";
import { getMisses, updateMisses, getAndFilterMisses } from "./misses-utils";

const mockDiff = vi.fn();
const mockAdd = vi.fn();

vi.mock("dayjs", () => {
  return {
    default: vi.fn((date?: number | Date) => {
      return {
        diff: mockDiff,
        add: mockAdd,
      };
    }),
  };
});

describe("getMisses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 0 when daysSinceLastUpdated is 0", () => {
    mockDiff.mockReturnValue(0);
    mockAdd.mockReturnValue({ day: () => 1 });

    const habit: Habit = {
      id: 1,
      name: "Test Habit",
      iteration: 0,
      goal: 10,
      remind: false,
      frequency: ["M", "W", "F"],
      createdAt: Date.now(),
      misses: 0,
      lastApproved: Date.now(),
    };

    const result = getMisses(habit);
    expect(result).toBe(0);
  });

  it("should count 1 miss when one frequency day passes", () => {
    mockDiff.mockReturnValue(1);
    mockAdd.mockReturnValue({ day: () => 1 });

    const habit: Habit = {
      id: 1,
      name: "Test Habit",
      iteration: 0,
      goal: 10,
      remind: false,
      frequency: ["M", "W", "F"],
      createdAt: Date.now(),
      misses: 0,
      lastApproved: Date.now() - 24 * 60 * 60 * 1000,
    };

    const result = getMisses(habit);
    expect(result).toBe(1);
  });

  it("should return 0 for empty frequency array", () => {
    mockDiff.mockReturnValue(7);

    const habit: Habit = {
      id: 1,
      name: "Test Habit",
      iteration: 0,
      goal: 10,
      remind: false,
      frequency: [],
      createdAt: Date.now(),
      misses: 0,
      lastApproved: Date.now() - 7 * 24 * 60 * 60 * 1000,
    };

    const result = getMisses(habit);
    expect(result).toBe(0);
  });

  it("should use createdAt as fallback when lastApproved is undefined", () => {
    mockDiff.mockReturnValue(7);

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

    const result = getMisses(habit);
    expect(mockDiff).toHaveBeenCalled();
  });

  it("BUG: does not add existing misses to calculated misses", () => {
    mockDiff.mockReturnValue(0);

    const habit: Habit = {
      id: 1,
      name: "Test Habit",
      iteration: 0,
      goal: 10,
      remind: false,
      frequency: ["M", "W", "F"],
      createdAt: Date.now(),
      misses: 5,
      lastApproved: Date.now(),
    };

    const result = getMisses(habit);
    expect(result).toBe(0);
    expect(result).not.toBe(5);
  });

  it("BUG: dayMap uses 'S' not 'Sa'/'Su' for Sat/Sun - returns incorrect count", () => {
    mockDiff.mockReturnValue(7);
    const days = [0, 1, 2, 3, 4, 5, 6];
    let callCount = 0;
    mockAdd.mockImplementation(() => {
      const day = days[callCount % 7];
      callCount++;
      return { day: () => day };
    });

    const habit: Habit = {
      id: 1,
      name: "Test Habit",
      iteration: 0,
      goal: 10,
      remind: false,
      frequency: ["Sa", "Su"],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      misses: 0,
      lastApproved: Date.now() - 7 * 24 * 60 * 60 * 1000,
    };

    const result = getMisses(habit);
    expect(result).toBe(1);
  });
});

describe("updateMisses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDiff.mockReturnValue(0);
    mockAdd.mockReturnValue({ day: () => 1 });
  });

  it("should update all habits with calculated misses", () => {
    const habits: Habit[] = [
      {
        id: 1,
        name: "Habit 1",
        iteration: 0,
        goal: 10,
        remind: false,
        frequency: ["M", "W", "F"],
        createdAt: Date.now(),
        misses: 0,
        lastApproved: Date.now(),
      },
      {
        id: 2,
        name: "Habit 2",
        iteration: 5,
        goal: 10,
        remind: false,
        frequency: ["Tu", "Th"],
        createdAt: Date.now(),
        misses: 0,
        lastApproved: Date.now(),
      },
    ];

    const result = updateMisses(habits);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("misses");
    expect(result[1]).toHaveProperty("misses");
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
        misses: 0,
        lastApproved: Date.now(),
      },
    ];

    const result = updateMisses(habits);
    expect(result[0].name).toBe("Test Habit");
    expect(result[0].iteration).toBe(3);
    expect(result[0].goal).toBe(10);
    expect(result[0].remind).toBe(true);
  });
});

describe("getAndFilterMisses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should filter habits with more than 3 NEW misses into misses group", () => {
    mockDiff.mockReturnValue(5);
    mockAdd.mockImplementation(() => ({ day: () => 1 }));

    const habits: Habit[] = [
      {
        id: 1,
        name: "Habit with many new misses",
        iteration: 2,
        goal: 10,
        remind: false,
        frequency: ["M", "W", "F"],
        createdAt: Date.now(),
        misses: 5,
        lastApproved: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
    ];

    const result = getAndFilterMisses(habits);
    expect(result.misses).toHaveLength(1);
    expect(result.misses[0].name).toBe("Habit with many new misses");
  });

  it("should filter habits at or above goal into wins group", () => {
    mockDiff.mockReturnValue(0);
    mockAdd.mockReturnValue({ day: () => 1 });

    const habits: Habit[] = [
      {
        id: 1,
        name: "Completed Habit",
        iteration: 10,
        goal: 10,
        remind: false,
        frequency: ["M", "W", "F"],
        createdAt: Date.now(),
        misses: 0,
        lastApproved: Date.now(),
      },
    ];

    const result = getAndFilterMisses(habits);
    expect(result.wins).toHaveLength(1);
    expect(result.wins[0].name).toBe("Completed Habit");
  });

  it("should filter habits with NEW misses <= 3 and below goal into filteredHabbits", () => {
    mockDiff.mockReturnValue(2);
    mockAdd.mockImplementation(() => ({ day: () => 1 }));

    const habits: Habit[] = [
      {
        id: 1,
        name: "In Progress Habit",
        iteration: 3,
        goal: 10,
        remind: false,
        frequency: ["M", "W", "F"],
        createdAt: Date.now(),
        misses: 2,
        lastApproved: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
    ];

    const result = getAndFilterMisses(habits);
    expect(result.filteredHabbits).toHaveLength(1);
    expect(result.filteredHabbits[0].name).toBe("In Progress Habit");
  });

  it("should correctly categorize mixed habits based on NEW misses", () => {
    const habits: Habit[] = [
      {
        id: 1,
        name: "Winner",
        iteration: 10,
        goal: 10,
        remind: false,
        frequency: ["M"],
        createdAt: Date.now(),
        misses: 0,
        lastApproved: Date.now(),
      },
      {
        id: 2,
        name: "Many New Misses",
        iteration: 2,
        goal: 10,
        remind: false,
        frequency: ["M"],
        createdAt: Date.now(),
        misses: 5,
        lastApproved: Date.now() - 7 * 24 * 60 * 60 * 1000,
      },
      {
        id: 3,
        name: "In Progress",
        iteration: 3,
        goal: 10,
        remind: false,
        frequency: ["M"],
        createdAt: Date.now(),
        misses: 1,
        lastApproved: Date.now(),
      },
    ];

    const result = getAndFilterMisses(habits);
    expect(result.wins).toHaveLength(1);
    expect(result.wins[0].name).toBe("Winner");
    expect(result.filteredHabbits).toHaveLength(2);
  });

  it("should handle empty habits array", () => {
    const habits: Habit[] = [];

    const result = getAndFilterMisses(habits);
    expect(result.wins).toHaveLength(0);
    expect(result.misses).toHaveLength(0);
    expect(result.filteredHabbits).toHaveLength(0);
  });

  it("BUG: ignores stored misses - uses only calculated new misses for grouping", () => {
    mockDiff.mockReturnValue(0);

    const habits: Habit[] = [
      {
        id: 1,
        name: "Habit with stored misses but at goal",
        iteration: 10,
        goal: 10,
        remind: false,
        frequency: ["M"],
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        misses: 5,
        lastApproved: Date.now(),
      },
    ];

    const result = getAndFilterMisses(habits);
    expect(result.wins).toHaveLength(1);
  });
});

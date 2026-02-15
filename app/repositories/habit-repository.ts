import * as SQLite from "expo-sqlite";

export type Habit = {
  id: number;
  name: string;
  iteration: number;
  goal: number;
  remind: boolean;
  frequency: Array<string>;
  lastUpdated?: number;
  misses: number;
  createdAt: number;
  lastApproved: number;
};

const HABIT_TABLE_NAME = "habits";

export const initHabitTable = async () => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  try {
    await db.execAsync("PRAGMA journal_mode = WAL;");
    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${HABIT_TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      iteration INTEGER DEFAULT 0,
      goal INTEGER NOT NULL,
      remind BOOLEAN DEFAULT 0,
      frequency TEXT,
      lastUpdated DATETIME,
      lastApproved DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      misses INTEGER DEFAULT 0
    )`;
    await db.execAsync(createTableSQL);
  } catch (e) {
    console.log("Error initializing table", e);
  }
};

export const seedDB = async () => {
  console.log("Getting DB context");
  const db = await SQLite.openDatabaseAsync("habitsDB");

  try {
    // Check if table already has data
    const existingCount = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${HABIT_TABLE_NAME}`,
    );

    if (existingCount && existingCount.count > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Example seed data
    console.log("Setting up Seed data");
    const seedHabits: Omit<Habit, "id">[] = [
      {
        name: "Drink Water",
        iteration: 0,
        goal: 18,
        remind: true,
        frequency: ["M", "Tu", "W", "Th", "F"],
        createdAt: Date.now(),
        misses: 1,
      },
      {
        name: "Read Book",
        iteration: 0,
        goal: 6,
        remind: false,
        frequency: ["Sa", "Su"],
        createdAt: Date.now(),
        misses: 3,
      },
      {
        name: "Exercise",
        iteration: 0,
        goal: 10,
        remind: true,
        frequency: ["M", "W", "F"],
        createdAt: Date.now(),
        misses: 2,
      },
    ];
    console.log("Seeding habits");
    await Promise.all(
      seedHabits.map((habit) => {
        const freqString = habit.frequency.join(",");
        return db.runAsync(
          `INSERT INTO ${HABIT_TABLE_NAME} (name, iteration, goal, remind, frequency, createdAt, misses) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            habit.name,
            habit.iteration,
            habit.goal,
            habit.remind ? 1 : 0,
            freqString,
            habit.createdAt,
            habit.misses ?? 0,
          ],
        );
      }),
    );
    console.log("Database seeded successfully");
  } catch (e) {
    console.log("Error seeding database", e);
  }
};

export const insertHabit = async (habit: Omit<Habit, "id">) => {
  const {
    name,
    iteration,
    goal,
    remind = false,
    frequency,
    createdAt,
    misses,
  } = habit;
  const db = await SQLite.openDatabaseAsync("habitsDB");

  try {
    const freqString = frequency ? frequency.join(",") : "";
    await db.runAsync(
      `INSERT INTO ${HABIT_TABLE_NAME} (name, iteration, goal, remind, frequency, createdAt, misses) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        iteration,
        goal,
        remind ? 1 : 0,
        freqString,
        createdAt,
        misses ?? 0,
      ],
    );
  } catch (e) {
    console.log("Error inserting habit", e);
    throw e;
  }
};

export const updateHabit = async (habit: Habit) => {
  const {
    id,
    name,
    iteration,
    goal,
    remind = false,
    frequency,
    lastUpdated,
    misses,
  } = habit;
  const db = await SQLite.openDatabaseAsync("habitsDB");

  try {
    const freqString = frequency ? frequency.join(",") : "";
    await db.runAsync(
      `UPDATE ${HABIT_TABLE_NAME}
       SET name = ?, iteration = ?, goal = ?, remind = ?, frequency = ?, lastUpdated = ?, misses = ?
       WHERE id = ?`,
      [
        name,
        iteration,
        goal,
        remind ? 1 : 0,
        freqString,
        lastUpdated ?? Date.now(),
        misses,
        id,
      ],
    );
  } catch (e) {
    console.log("Error updating habit", e);
    throw e;
  }
};

export const updateHabits = async (habits: Habit[]) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");

  try {
    await db.withTransactionAsync(async () => {
      for (const habit of habits) {
        const {
          id,
          name,
          iteration,
          goal,
          remind = false,
          frequency,
          lastUpdated,
          misses,
        } = habit;
        const freqString = frequency ? frequency.join(",") : "";

        await db.runAsync(
          `UPDATE ${HABIT_TABLE_NAME}
           SET name = ?, iteration = ?, goal = ?, remind = ?, frequency = ?, lastUpdated = ?, misses = ?
           WHERE id = ?`,
          [
            name,
            iteration,
            goal,
            remind ? 1 : 0,
            freqString,
            lastUpdated ?? Date.now(),
            misses,
            id,
          ],
        );
      }
    });
  } catch (e) {
    console.log("Error updating habits in transaction", e);
    throw e;
  }
};

interface RawHabit extends Omit<Habit, "frequency"> {
  frequency: string;
}

export const getHabitsFromDb = async (): Promise<Habit[]> => {
  const db = await SQLite.openDatabaseAsync("habitsDB");

  try {
    const results = await db.getAllAsync<RawHabit>(
      `SELECT id, name, iteration, goal, frequency, lastUpdated, lastApproved, misses, createdAt, remind FROM ${HABIT_TABLE_NAME}`,
    );

    const parsedHabits = results.map((habit) => ({
      ...habit,
      remind: habit.remind ? true : false,
      frequency: habit.frequency ? habit.frequency.split(",") : [],
    }));

    return parsedHabits;
  } catch (e) {
    console.log("Error fetching habits", e);
    return [];
  }
};

export const incrementHabit = async (id: number, iteration: number) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");

  try {
    await db.runAsync(
      `UPDATE ${HABIT_TABLE_NAME}
       SET iteration = ?, lastUpdated = ?, lastApproved = ?, misses = 0
       WHERE id = ?`,
      [iteration + 1, Date.now(), Date.now(), id],
    );
  } catch (e) {
    console.log("Error incrementing habit", e);
    throw e;
  }
};

export const deleteHabit = async (id: number) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");

  try {
    await db.runAsync(`DELETE FROM ${HABIT_TABLE_NAME} WHERE id = ?`, [id]);
  } catch (e) {
    console.log("Error deleting habit", e);
    throw e;
  }
};

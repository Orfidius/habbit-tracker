import * as SQLite from "expo-sqlite";

export type Habit = {
  id: number;
  name: string;
  iteration: number;
  goal: number;
  remind: boolean;
  frequency: Set<string>;
  lastUpdated?: number;
  misses?: number;
  createdAt: number;
};

const TABLE_NAME = "habits";

export const initDB = async () => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  try {
    const result = await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        iteration INTEGER,
                        goal INTEGER,
                        remind BOOLEAN,
                        frequency TEXT,
                        lastUpdated DATETIME,
                        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                        misses INTEGER
                      );
`);
  } catch (e) {
    console.log("Error", e);
  }
};

export const seedDB = async () => {
  const db = await SQLite.openDatabaseAsync("habitsDB");

  // Example seed data
  const seedHabits: Omit<Habit, "id">[] = [
    {
      name: "Drink Water",
      iteration: 0,
      goal: 8,
      remind: true,
      frequency: new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]),
      createdAt: Date.now(),
    },
    {
      name: "Read Book",
      iteration: 0,
      goal: 1,
      remind: false,
      frequency: new Set(["Sat", "Sun"]),
      createdAt: Date.now(),
      misses: 3,
    },
    {
      name: "Exercise",
      iteration: 0,
      goal: 3,
      remind: true,
      frequency: new Set(["Mon", "Wed", "Fri"]),
      createdAt: Date.now(),
      misses: 2,
    },
  ];
  console.log("Seeding habbits");
  for (const habit of seedHabits) {
    const freqString = Array.from(habit.frequency).join(",");
    await db.runAsync(
      `INSERT INTO habits (name, iteration, goal, remind, frequency, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        habit.name,
        habit.iteration,
        habit.goal,
        habit.remind ? 1 : 0,
        freqString,
        habit.createdAt,
      ],
    );
  }
};

// // // TODO: move Database into some kind of shared context, either class
export const insertHabit = async (habit: Habit) => {
  const { name, iteration, goal, remind = false, frequency } = habit;
  const valuesToAdd = [`"${name}"`, iteration, goal, remind];
  if (frequency) {
    const freqArray = Array.from(frequency);
    valuesToAdd.push(`"${freqArray.join(",")}"`);
  }

  const db = await SQLite.openDatabaseAsync("habitsDB");
  const result = await db.execAsync(`
        INSERT INTO habits (name, iteration, goal, remind, frequency )
        VALUES (${valuesToAdd.join(",")})`);
};

export const updateHabit = async (habit: Habit) => {
  const { id, remind = false, frequency, ...habbit } = habit;
  const habitPayload = Object.entries(habbit).map(([key, val]) => {
    if (typeof val === "string") return `${key} = "${val}"`;
    return `${key} = ${val}`;
  });
  if (frequency) {
    const freqString = Array.from(frequency).join(",");
    habitPayload.push(`frequency = "${freqString}"`);
  }
  habitPayload.push(`remind = ${remind}`);
  const db = await SQLite.openDatabaseAsync("habitsDB");
  const result = await db.runAsync(`
        UPDATE habits
        SET ${habitPayload.join(",")}
        WHERE id=${id}`);
};

export const updateHabits = async (habits: Habit[]) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  await db.withTransactionAsync(async () => {
    for (const habit of habits) {
      const { id, remind = false, frequency, ...habbit } = habit;
      const habitPayload = Object.entries(habbit).map(([key, val]) => {
        if (typeof val === "string") return `${key} = "${val}"`;
        return `${key} = ${val}`;
      });
      if (frequency) {
        const freqString = Array.from(frequency).join(",");
        habitPayload.push(`frequency = "${freqString}"`);
      }
      habitPayload.push(`remind = ${remind}`);
      await db.runAsync(
        `UPDATE habits SET ${habitPayload.join(",")} WHERE id=${id}`,
      );
    }
  });
};

interface RawHabit extends Omit<Habit, "frequency"> {
  frequency: string;
}
export const gethabits = async (): Promise<Habit[]> => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  const results = await db.getAllAsync<RawHabit>(
    `SELECT id, name, iteration, goal, frequency, lastUpdated FROM ${TABLE_NAME}`,
  );
  const parsedHabits = results.map((habit) => ({
    ...habit,
    frequency: new Set(habit.frequency.split(",")),
  }));
  return parsedHabits;
};

export const incrementHabit = async (id: number, iteration: number) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  await db.runAsync(`
            UPDATE habits
            SET
                iteration = ${iteration + 1},
                lastUpdated = ${Date.now()},
                misses = 0
            WHERE id == ${id}
        `);
};

export const deleteHabit = async (id: number) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  await db.runAsync(`
    DELETE FROM habits
    WHERE id = ${id}
   `);
};

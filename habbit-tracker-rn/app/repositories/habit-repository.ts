import * as SQLite from "expo-sqlite";

export type Habit = {
  id: number;
  name: string;
  iteration: number;
  goal: number;
  remind: boolean;
  frequency: Set<string>;
  lastUpdated?: number;
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
                        lastUpdated DATETIME
                      );
`);
  } catch (e) {
    console.log("Error", e);
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
                lastUpdated = ${Date.now()}
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

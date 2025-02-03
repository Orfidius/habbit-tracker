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
  console.log("Joker running init");
  const db = await SQLite.openDatabaseAsync("habitsDB");
  console.log("Got DB");
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
    console.log("Joker completed migrationr", JSON.stringify(result));
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
  console.log("batman", valuesToAdd.join(","));
  const db = await SQLite.openDatabaseAsync("habitsDB");
  const result = await db.execAsync(`
        INSERT INTO habits (name, iteration, goal, remind, frequency )
        VALUES (${valuesToAdd.join(",")})`);
  console.log("Batman Result", result);
  console.log("Called insert");
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
  console.log(result);
  console.log("Called update");
};

interface RawHabit extends Omit<Habit, "frequency"> {
  frequency: string;
}
export const gethabits = async (): Promise<Habit[]> => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  const results = await db.getAllAsync<RawHabit>(
    `SELECT id, name, iteration, goal, frequency, lastUpdated FROM ${TABLE_NAME}`,
  );
  console.log("Batman", JSON.stringify(results));
  const parsedHabits = results.map((habit) => ({
    ...habit,
    frequency: new Set(habit.frequency.split(",")),
  }));
  return parsedHabits;
};

export const incrementHabit = async (id: number, iteration: number) => {
  console.log("Batman Incrementing habit", id, iteration);
  const db = await SQLite.openDatabaseAsync("habitsDB");
  const result = await db.runAsync(`
            UPDATE habits
            SET
                iteration = ${iteration + 1},
                lastUpdated = ${Date.now()}
            WHERE id == ${id}
        `);
  console.log(result);
  console.log("increment habbit");
};

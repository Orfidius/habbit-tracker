import Database from "@tauri-apps/plugin-sql";

export type Habit = {
  id: number;
  name: string;
  iteration: number;
  goal: number;
  remind: boolean;
  frequency: Set<string>;
  lastUpdated?: number;
};

// TODO: move Database into some kind of shared context, either class
export const insertHabit = async (habit: Habit) => {
  // when using `"withGlobalTauri": true`, you may use
  // const V = window.__TAURI__.sql;
  const { name, iteration, goal, remind = false, frequency } = habit;
  const valuesToAdd = [`"${name}"`, iteration, goal, remind];
  if (frequency) {
    const freqArray = Array.from(frequency);
    valuesToAdd.push(`"${freqArray.join(",")}"`);
  }
  console.log("batman", valuesToAdd.join(","));
  const db = await Database.load("sqlite:habit.db");
  const result = await db.execute(`
        INSERT INTO habits (name, iteration, goal, remind, frequency )
        VALUES (${valuesToAdd.join(",")})`);
  console.log(result);
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
  const db = await Database.load("sqlite:habit.db");
  const result = await db.execute(`
        UPDATE habits
        SET ${habitPayload.join(",")}
        WHERE id=${id}`);
  console.log(result);
};

interface RawHabit extends Omit<Habit, "frequency"> {
  frequency: string;
}
export const gethabits = async (): Promise<Habit[]> => {
  const db = await Database.load("sqlite:habit.db");
  const results = await db.select<RawHabit[]>(
    "SELECT id, name, iteration, goal, frequency, lastUpdated FROM habits",
  );
  const parsedHabits = results.map((habit) => ({
    ...habit,
    frequency: new Set(habit.frequency.split(",")),
  }));
  return parsedHabits;
};

export const incrementHbbit = async (id: number, iteration: number) => {
  const db = await Database.load("sqlite:habit.db");
  const result = await db.execute(`
            UPDATE habits
            SET
                iteration = ${iteration + 1},
                lastUpdated = ${Date.now()}
            WHERE id == ${id}
        `);
  console.log(result);
};

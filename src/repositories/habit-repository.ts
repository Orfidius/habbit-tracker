import Database from '@tauri-apps/plugin-sql';

export enum Frequency {
    DAILY, 
    MONTHLY, 
    HOURLY, 
    WEEKLY
}

export type Habit = {
    id: number; 
    name: string,
    iteration: number,
    goal: number,
    remind: boolean,
    frequency: Frequency,
    lastUpdated?: number;
}

// TODO: move Database into some kind of shared context, either class  
export const inserthabit = async (habit: Habit) => {
    // when using `"withGlobalTauri": true`, you may use
    // const V = window.__TAURI__.sql;
    const { name, iteration, goal, remind = false, frequency} = habit;

    const db = await Database.load('sqlite:habit.db');
    const result = await db.execute(`
        INSERT INTO habits (name, iteration, goal, remind, frequency ) 
        VALUES ('${name}',${iteration}, ${goal}, ${remind}, '${frequency}')`
    );
// const result = await db.select(`
// SELECT name FROM sqlite_master;
// `);
console.log(result);
}

export const gethabits = async () => {
    const db = await Database.load('sqlite:habit.db');
    const results = await db.select<Habit[]>('SELECT id, name, iteration, goal, frequency, lastUpdated FROM habits');
    return results;
}

export const incrementHbbit = async (id: number, iteration: number) => {
    const db = await Database.load('sqlite:habit.db');
    const result = await db.execute(`
            UPDATE habits
            SET 
                iteration = ${iteration + 1},
                lastUpdated = ${Date.now()}
            WHERE id == ${id}
        `);
    console.log(result);
} 
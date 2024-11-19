import Database from '@tauri-apps/plugin-sql';

export enum Frequency {
    DAILY, 
    MONTHLY, 
    HOURLY, 
    WEEKLY
}

export type Habbit = {
    id: number; 
    name: string,
    iteration: number,
    goal: number,
    remind: boolean,
    frequency: Frequency,
}
export const saveHabbit = async (habbit: Habbit) => {
    // when using `"withGlobalTauri": true`, you may use
    // const V = window.__TAURI__.sql;
    // const { name, iteration, goal, remind = false, frequency} = habbit;
    const columns = Object.keys(habbit);
    const values = Object.values(habbit);

    const db = await Database.load('sqlite:habbit.db');
    await db.execute(`
        INSERT INTO habbits  (${columns.join(',')}) 
        VALUES (${values.join(',')})`
    );
}
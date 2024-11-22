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
// TODO: move Database into some kind of shared context, either class  
export const saveHabbit = async (habbit: Habbit) => {
    // when using `"withGlobalTauri": true`, you may use
    // const V = window.__TAURI__.sql;
    const { name, iteration, goal, remind = false, frequency} = habbit;

    const db = await Database.load('sqlite:habbit.db');
    const result = await db.execute(`
        INSERT INTO habbits (name, iteration, goal, remind, frequency ) 
        VALUES ('${name}',${iteration}, ${goal}, ${remind}, '${frequency}')`
    );
// const result = await db.select(`
// SELECT name FROM sqlite_master;
// `);
console.log(result);
}

export const getHabbits = async () => {
    const db = await Database.load('sqlite:habbit.db');
    const results = await db.select<Habbit[]>('SELECT name, iteration, goal FROM habbits');
    return results;
}

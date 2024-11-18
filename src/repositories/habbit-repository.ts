import Database from '@tauri-apps/plugin-sql';

export const saveHabbit = async () => {
    // when using `"withGlobalTauri": true`, you may use
    // const V = window.__TAURI__.sql;

    const db = await Database.load('sqlite:habbit.db');
    await db.execute('INSERT INTO habbits ');
}
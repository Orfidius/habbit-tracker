import * as SQLite from "expo-sqlite";
const STATS_TABLE_NAME = "stats";
export const initStatsTable = async () => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  try {
    const result = await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${STATS_TABLE_NAME} (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          habbitName TEXT,
                                          result TEXT CHECK(result IN ('win', 'loss')),
                                          goal INTEGER,
                                        );
`);
  } catch (e) {
    console.log("Error", e);
  }
};

export const getWins = async () => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  try {
    const result = await db.execAsync(
      `
      SELECT COUNT(*) as count FROM ${STATS_TABLE_NAME} WHERE result = 'win';
    `,
    );
    return result;
  } catch (e) {
    console.log("Error", e);
  }
};

export const getLoses = async () => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  try {
    const result = await db.runAsync(
      `
      SELECT COUNT(*) as count FROM ${STATS_TABLE_NAME}  result = 'loss';
    `,
    );
    return result;
  } catch (e) {
    console.log("Error", e);
  }
};

export const updateStats = async (
  habbitName: string,
  result: string,
  goal: number,
) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  try {
    const response = await db.runAsync(
      `
      INSERT INTO ${STATS_TABLE_NAME} (habbitName, result, goal) VALUES (?, ?, ?);
    `,
      [habbitName, result, goal],
    );
    return response;
  } catch (e) {
    console.log("Error", e);
  }
};

export const deleteStats = async (habbitName: string) => {
  const db = await SQLite.openDatabaseAsync("habitsDB");
  try {
    const result = await db.runAsync(
      `
      DELETE FROM ${STATS_TABLE_NAME} WHERE habbitName = ?;
    `,
      [habbitName],
    );
    return result;
  } catch (e) {
    console.log("Error", e);
  }
};

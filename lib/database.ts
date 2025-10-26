// lib/database.ts
import * as SQLite from "expo-sqlite";

export type Frequency = "Täglich" | "Wöchentlich" | "Monatlich";
export type Habit = {
  id?: number;
  title: string;
  description: string;
  frequency: Frequency;
  created_at: number;
};

let db: SQLite.SQLiteDatabase | null = null;

export async function initDB() {
  if (!db) {
    // öffnet/erstellt habits.db im App-Speicher
    db = await SQLite.openDatabaseAsync("habits.db");
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        frequency TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
  }
  return db!;
}

export async function insertHabit(h: Habit) {
  const database = await initDB();
  await database.runAsync(
    `INSERT INTO habits (title, description, frequency, created_at)
     VALUES (?, ?, ?, ?)`,
    [h.title, h.description, h.frequency, h.created_at]
  );
}

export async function getAllHabits(): Promise<Habit[]> {
  const database = await initDB();
  const rows = await database.getAllAsync<Habit>(`SELECT * FROM habits ORDER BY created_at DESC`);
  return rows;
}

export default { initDB, insertHabit, getAllHabits };

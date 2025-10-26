import * as SQLite from "expo-sqlite";

export type Frequency = "Täglich" | "weWöchentlich" | "Monatlich";
export type HabitRow = {
  id: number;
  title: string;
  description: string | null;
  frequency: Frequency;
  created_at: number;
  streak_count: number;         // NEW
  last_completed: number | null; // NEW (ms since epoch)
};

let db: SQLite.SQLiteDatabase | null = null;

export async function initDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("habits.db");
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        frequency TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        streak_count INTEGER NOT NULL DEFAULT 0,
        last_completed INTEGER
      );
    `);
    /* if you created the table earlier without the two columns,
       this adds them on old installs (SQLite allows ADD COLUMN) */
    await db.execAsync(`ALTER TABLE habits ADD COLUMN streak_count INTEGER NOT NULL DEFAULT 0;`).catch(()=>{});
    await db.execAsync(`ALTER TABLE habits ADD COLUMN last_completed INTEGER;`).catch(()=>{});
  }
  return db!;
}

export async function getAllHabits(): Promise<HabitRow[]> {
  const database = await initDB();
  return database.getAllAsync<HabitRow>(
    `SELECT id, title, description, frequency, created_at, streak_count, last_completed
     FROM habits ORDER BY created_at DESC`
  );
}

export async function insertHabit(h: {
  title: string; description: string; frequency: Frequency; created_at: number;
}) {
  const database = await initDB();
  await database.runAsync(
    `INSERT INTO habits (title, description, frequency, created_at)
     VALUES (?, ?, ?, ?)`,
    [h.title, h.description, h.frequency, h.created_at]
  );
}

export async function deleteHabit(id: number) {
  const database = await initDB();
  await database.runAsync(`DELETE FROM habits WHERE id = ?`, [id]);
}

/** Mark as completed "today" (increments streak once per day) */
export async function completeHabit(id: number) {
  const database = await initDB();
  const [row] = await database.getAllAsync<HabitRow>(
    `SELECT id, streak_count, last_completed FROM habits WHERE id = ?`,
    [id]
  );

  const now = Date.now();
  const isSameDay = (a?: number | null, b?: number | null) => {
    if (!a || !b) return false;
    const A = new Date(a); A.setHours(0,0,0,0);
    const B = new Date(b); B.setHours(0,0,0,0);
    return A.getTime() === B.getTime();
  };

  const alreadyToday = row && isSameDay(row.last_completed ?? undefined, now);
  const nextStreak = row ? (alreadyToday ? row.streak_count : row.streak_count + 1) : 1;

  await database.runAsync(
    `UPDATE habits SET streak_count = ?, last_completed = ? WHERE id = ?`,
    [nextStreak, now, id]
  );
}

export default { initDB, getAllHabits, insertHabit, deleteHabit, completeHabit };

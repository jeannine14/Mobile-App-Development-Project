export type Frequency = "Täglich" | "Wöchentlich" | "Monatlich";
export type HabitRow = {
  id: string;
  title: string;
  description: string;
  frequency: Frequency;
  created_at: number;
  streak_count: number;
  last_completed: number | null;
};

const KEY = "habits";

const read = (): HabitRow[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const write = (list: HabitRow[]) => localStorage.setItem(KEY, JSON.stringify(list));

export async function initDB() {}

export async function getAllHabits(): Promise<HabitRow[]> {
  return read().sort((a,b) => b.created_at - a.created_at);
}

export async function insertHabit(h: {
  title: string; description: string; frequency: Frequency; created_at: number;
}) {
  const list = read();
  list.push({
    id: crypto.randomUUID?.() ?? String(Date.now()),
    title: h.title,
    description: h.description,
    frequency: h.frequency,
    created_at: h.created_at,
    streak_count: 0,
    last_completed: null,
  });
  write(list);
}

export async function deleteHabit(id: string) {
  write(read().filter(h => h.id !== id));
}

export async function completeHabit(id: string) {
  const list = read();
  const now = Date.now();
  const isSameDay = (t?: number | null) => {
    if (!t) return false;
    const A = new Date(t); A.setHours(0,0,0,0);
    const B = new Date(now); B.setHours(0,0,0,0);
    return A.getTime() === B.getTime();
  };
  const idx = list.findIndex(h => h.id === id);
  if (idx >= 0) {
    const h = list[idx];
    list[idx] = {
      ...h,
      streak_count: isSameDay(h.last_completed) ? h.streak_count : h.streak_count + 1,
      last_completed: now,
    };
    write(list);
  }
}

export default { initDB, getAllHabits, insertHabit, deleteHabit, completeHabit };

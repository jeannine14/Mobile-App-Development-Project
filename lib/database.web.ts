// lib/database.web.ts
export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: string; // "Täglich"
  created_at: number;
};

export type Completion = {
  id: string;
  habit_id: string;
  completed_at: number;
};

const HABITS = "habits";
const COMPLETIONS = "completions";

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function initDB() {
  return true;
}

export async function insertHabit(h: Omit<Habit, "id">) {
  const list = read<Habit>(HABITS);
  list.push({
    id: crypto.randomUUID?.() ?? String(Date.now()),
    ...h,
    frequency: "Täglich",
  });
  write(HABITS, list);
}

export async function deleteHabit(id: string) {
  write(HABITS, read<Habit>(HABITS).filter((x) => x.id !== id));
  write(
    COMPLETIONS,
    read<Completion>(COMPLETIONS).filter((c) => c.habit_id !== id)
  );
}

export async function getAllHabits(): Promise<Habit[]> {
  return read<Habit>(HABITS).sort((a, b) => b.created_at - a.created_at);
}

export async function addCompletion(habitId: string, when: number) {
  const list = read<Completion>(COMPLETIONS);
  list.push({
    id: crypto.randomUUID?.() ?? String(Date.now()),
    habit_id: habitId,
    completed_at: when,
  });
  write(COMPLETIONS, list);
}

export async function getAllCompletions(): Promise<Completion[]> {
  return read<Completion>(COMPLETIONS).sort(
    (a, b) => a.completed_at - b.completed_at
  );
}

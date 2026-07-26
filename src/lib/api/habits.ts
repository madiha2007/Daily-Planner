import { Habit } from '@/lib/types';
import { generateMockHabits } from '@/lib/mock/generateMockData';
import { uid, formatDateISO } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

let _habits: Habit[] | null = null;

function ensureSeeded(): Habit[] {
  if (!_habits) {
    _habits = generateMockHabits();
  }
  return _habits;
}

export async function fetchHabits(): Promise<Habit[]> {
  return delay([...ensureSeeded()]);
}

export async function createHabit(input: Omit<Habit, 'id' | 'createdAt' | 'completions'>): Promise<Habit> {
  const habit: Habit = {
    ...input,
    id: uid(),
    completions: [],
    createdAt: new Date().toISOString(),
  };
  ensureSeeded().push(habit);
  return delay(habit);
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
  const habits = ensureSeeded();
  const index = habits.findIndex((h) => h.id === id);
  if (index === -1) throw new Error(`Habit ${id} not found`);
  habits[index] = { ...habits[index], ...updates };
  return delay(habits[index]);
}

export async function toggleHabitToday(id: string): Promise<Habit> {
  const habits = ensureSeeded();
  const habit = habits.find((h) => h.id === id);
  if (!habit) throw new Error(`Habit ${id} not found`);
  const today = formatDateISO(new Date());
  const hasToday = habit.completions.includes(today);
  habit.completions = hasToday
    ? habit.completions.filter((d) => d !== today)
    : [...habit.completions, today];
  return delay(habit);
}

export async function deleteHabit(id: string): Promise<{ id: string }> {
  const habits = ensureSeeded();
  _habits = habits.filter((h) => h.id !== id);
  return delay({ id });
}

import { Habit } from '@/lib/types';
import { generateMockHabits } from '@/lib/mock/generateMockData';
import { uid } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

export async function fetchHabits(): Promise<Habit[]> {
  return delay(generateMockHabits());
}

export async function createHabit(input: Omit<Habit, 'id' | 'createdAt' | 'completions'>): Promise<Habit> {
  const habit: Habit = {
    ...input,
    id: uid(),
    completions: [],
    createdAt: new Date().toISOString(),
  };
  return delay(habit);
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<void> {
  await delay(undefined);
}

export async function toggleHabitToday(id: string): Promise<void> {
  await delay(undefined);
}

export async function deleteHabit(id: string): Promise<void> {
  await delay(undefined);
}
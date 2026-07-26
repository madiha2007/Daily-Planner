import { Goal } from '@/lib/types';
import { generateMockGoals } from '@/lib/mock/generateMockData';
import { uid } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

let _goals: Goal[] | null = null;

function ensureSeeded(): Goal[] {
  if (!_goals) {
    _goals = generateMockGoals();
  }
  return _goals;
}

export async function fetchGoals(): Promise<Goal[]> {
  return delay([...ensureSeeded()]);
}

export async function createGoal(input: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
  const goal: Goal = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  ensureSeeded().push(goal);
  return delay(goal);
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
  const goals = ensureSeeded();
  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) throw new Error(`Goal ${id} not found`);
  goals[index] = { ...goals[index], ...updates };
  return delay(goals[index]);
}

export async function deleteGoal(id: string): Promise<{ id: string }> {
  const goals = ensureSeeded();
  _goals = goals.filter((g) => g.id !== id);
  return delay({ id });
}

import { Goal } from '@/lib/types';
import { generateMockGoals } from '@/lib/mock/generateMockData';
import { uid } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

export async function fetchGoals(): Promise<Goal[]> {
  return delay(generateMockGoals());
}

export async function createGoal(input: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
  const goal: Goal = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  return delay(goal);
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  await delay(undefined);
}

export async function deleteGoal(id: string): Promise<void> {
  await delay(undefined);
}
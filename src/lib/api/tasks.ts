import { Task } from '@/lib/types';
import { generateMockTasks } from '@/lib/mock/generateMockData';
import { uid } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

export async function fetchTasks(): Promise<Task[]> {
  return delay(generateMockTasks());
}

export async function createTask(input: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const task: Task = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  return delay(task);
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  await delay(undefined);
}

export async function deleteTask(id: string): Promise<void> {
  await delay(undefined);
}
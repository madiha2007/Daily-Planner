import { Task } from '@/lib/types';
import { generateMockTasks } from '@/lib/mock/generateMockData';
import { uid } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

// Only used to seed demo data the very first time someone opens the app
// (before localStorage has anything in it). After that, the persisted
// Zustand store is the source of truth - these functions just simulate
// a network round trip and never need to "find" anything themselves.
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
  // Phase 2: PATCH /api/tasks/:id with `updates`
  await delay(undefined);
}

export async function deleteTask(id: string): Promise<void> {
  // Phase 2: DELETE /api/tasks/:id
  await delay(undefined);
}
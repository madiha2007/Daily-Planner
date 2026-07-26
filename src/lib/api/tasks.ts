import { Task } from '@/lib/types';
import { generateMockTasks } from '@/lib/mock/generateMockData';
import { uid } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

// In-memory store standing in for a real database during development.
let _tasks: Task[] | null = null;

function ensureSeeded(): Task[] {
  if (!_tasks) {
    _tasks = generateMockTasks();
  }
  return _tasks;
}

export async function fetchTasks(): Promise<Task[]> {
  // Phase 2: replace with `const res = await fetch('/api/tasks'); return res.json();`
  return delay([...ensureSeeded()]);
}

export async function createTask(input: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const task: Task = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  ensureSeeded().push(task);
  return delay(task);
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const tasks = ensureSeeded();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error(`Task ${id} not found`);
  tasks[index] = { ...tasks[index], ...updates };
  return delay(tasks[index]);
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  const tasks = ensureSeeded();
  _tasks = tasks.filter((t) => t.id !== id);
  return delay({ id });
}

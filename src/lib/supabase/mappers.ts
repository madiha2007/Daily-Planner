import { Task, Habit, Goal, JournalEntry } from '@/lib/types';

export function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes ?? undefined,
    priority: row.priority,
    done: row.done,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}
export function taskToRow(uid: string, input: Partial<Task>) {
  const row: Record<string, unknown> = { user_id: uid };
  if (input.title !== undefined) row.title = input.title;
  if (input.notes !== undefined) row.notes = input.notes;
  if (input.priority !== undefined) row.priority = input.priority;
  if (input.done !== undefined) row.done = input.done;
  if (input.dueDate !== undefined) row.due_date = input.dueDate;
  return row;
}

export function rowToHabit(row: any): Habit {
  return {
    id: row.id,
    title: row.title,
    targetPerWeek: row.target_per_week,
    completions: row.completions ?? [],
    createdAt: row.created_at,
  };
}
export function habitToRow(uid: string, input: Partial<Habit>) {
  const row: Record<string, unknown> = { user_id: uid };
  if (input.title !== undefined) row.title = input.title;
  if (input.targetPerWeek !== undefined) row.target_per_week = input.targetPerWeek;
  if (input.completions !== undefined) row.completions = input.completions;
  return row;
}

export function rowToGoal(row: any): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    targetDate: row.target_date,
    progress: row.progress,
    milestones: row.milestones ?? [],
    createdAt: row.created_at,
  };
}
export function goalToRow(uid: string, input: Partial<Goal>) {
  const row: Record<string, unknown> = { user_id: uid };
  if (input.title !== undefined) row.title = input.title;
  if (input.description !== undefined) row.description = input.description;
  if (input.targetDate !== undefined) row.target_date = input.targetDate;
  if (input.progress !== undefined) row.progress = input.progress;
  if (input.milestones !== undefined) row.milestones = input.milestones;
  return row;
}

export function rowToJournalEntry(row: any): JournalEntry {
  return {
    id: row.id,
    title: row.title ?? undefined,
    content: row.content,
    mood: row.mood,
    color: row.color ?? 'peach',
    stickers: row.stickers ?? [],
    image: row.image ?? undefined,
    imagePosition: row.image_position ?? 'top',
    createdAt: row.created_at,
  };
}
export function journalEntryToRow(uid: string, input: Partial<JournalEntry>) {
  const row: Record<string, unknown> = { user_id: uid };
  if (input.title !== undefined) row.title = input.title;
  if (input.content !== undefined) row.content = input.content;
  if (input.mood !== undefined) row.mood = input.mood;
  if (input.color !== undefined) row.color = input.color;
  if (input.stickers !== undefined) row.stickers = input.stickers;
  if (input.image !== undefined) row.image = input.image;
  if (input.imagePosition !== undefined) row.image_position = input.imagePosition;
  return row;
}
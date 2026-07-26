import { JournalEntry } from '@/lib/types';
import { generateMockJournal } from '@/lib/mock/generateMockData';
import { uid } from '@/lib/utils';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

let _entries: JournalEntry[] | null = null;

function ensureSeeded(): JournalEntry[] {
  if (!_entries) {
    _entries = generateMockJournal();
  }
  return _entries;
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  return delay([...ensureSeeded()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
}

export async function createJournalEntry(
  input: Omit<JournalEntry, 'id' | 'createdAt'>
): Promise<JournalEntry> {
  const entry: JournalEntry = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  ensureSeeded().push(entry);
  return delay(entry);
}

export async function deleteJournalEntry(id: string): Promise<{ id: string }> {
  const entries = ensureSeeded();
  _entries = entries.filter((e) => e.id !== id);
  return delay({ id });
}

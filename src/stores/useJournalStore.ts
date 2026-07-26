import { create } from 'zustand';
import { JournalEntry } from '@/lib/types';
import { fetchJournalEntries, createJournalEntry, deleteJournalEntry } from '@/lib/api/journal';

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addEntry: (input: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const entries = await fetchJournalEntries();
      set({ entries, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addEntry: async (input) => {
    const entry = await createJournalEntry(input);
    set({ entries: [entry, ...get().entries] });
  },

  removeEntry: async (id) => {
    set({ entries: get().entries.filter((e) => e.id !== id) });
    await deleteJournalEntry(id);
  },
}));

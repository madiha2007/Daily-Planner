import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { JournalEntry } from '@/lib/types';
import { fetchJournalEntries, createJournalEntry, deleteJournalEntry } from '@/lib/api/journal';

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addEntry: (input: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  editEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      loading: false,
      error: null,

      // fetchAll: async () => {
      //   if (get().entries.length > 0) return;
      //   set({ loading: true, error: null });
      //   try {
      //     const entries = await fetchJournalEntries();
      //     set({ entries, loading: false });
      //   } catch (err) {
      //     set({ error: (err as Error).message, loading: false });
      //   }
      // },

      fetchAll: async () => {
  if (get().entries.length > 0) return;
  set({ loading: true, error: null });
  try {
    // No more mock seeding — starts empty, user adds real tasks.
    set({ entries: [], loading: false });
  } catch (err) {
    set({ error: (err as Error).message, loading: false });
  }
},
      addEntry: async (input) => {
        const entry = await createJournalEntry(input);
        set({ entries: [entry, ...get().entries] });
      },

      editEntry: async (id, updates) => {
        set({ entries: get().entries.map((e) => (e.id === id ? { ...e, ...updates } : e)) });
      },

      removeEntry: async (id) => {
        set({ entries: get().entries.filter((e) => e.id !== id) });
        await deleteJournalEntry(id);
      },
    }),
    {
      name: 'daily-planner:journal',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
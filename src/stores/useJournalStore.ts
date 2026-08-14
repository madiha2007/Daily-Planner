import { create } from 'zustand';
import { JournalEntry } from '@/lib/types';
import { subscribeToTable, insertRow, updateRow, deleteRow } from '@/lib/supabase/queries';
import { rowToJournalEntry, journalEntryToRow } from '@/lib/supabase/mappers';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  fetchAll: () => void;
  subscribe: (uid: string) => void;
  unsubscribe: () => void;
  addEntry: (input: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  editEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  reset: () => void;
}

let channel: RealtimeChannel | null = null;
let currentUid: string | null = null;

export const useJournalStore = create<JournalState>()((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  fetchAll: () => {
    const uid = useAuthStore.getState().user?.uid;
    if (uid) get().subscribe(uid);
  },

  subscribe: (uid) => {
    if (currentUid === uid && channel) return;
    if (channel) channel.unsubscribe();
    currentUid = uid;
    set({ loading: true, error: null });
    channel = subscribeToTable<any>('journal_entries', uid, (rows) => {
      set({ entries: rows.map(rowToJournalEntry), loading: false });
    });
  },

  unsubscribe: () => {
    if (channel) channel.unsubscribe();
    channel = null;
    currentUid = null;
  },

  addEntry: async (input) => {
    if (!currentUid) return;
    await insertRow('journal_entries', journalEntryToRow(currentUid, input));
  },

  editEntry: async (id, updates) => {
    if (!currentUid) return;
    await updateRow('journal_entries', id, journalEntryToRow(currentUid, updates));
  },

  removeEntry: async (id) => {
    await deleteRow('journal_entries', id);
  },

  reset: () => {
    set({ entries: [], loading: false, error: null });
  },
}));
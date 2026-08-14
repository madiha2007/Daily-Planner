import { create } from 'zustand';
import { Habit } from '@/lib/types';
import { subscribeToTable, insertRow, updateRow, deleteRow } from '@/lib/supabase/queries';
import { rowToHabit, habitToRow } from '@/lib/supabase/mappers';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDateISO } from '@/lib/utils';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface HabitState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  fetchAll: () => void;
  subscribe: (uid: string) => void;
  unsubscribe: () => void;
  addHabit: (input: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => Promise<void>;
  editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  toggleToday: (id: string) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  reset: () => void;
}

let channel: RealtimeChannel | null = null;
let currentUid: string | null = null;

export const useHabitStore = create<HabitState>()((set, get) => ({
  habits: [],
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
    channel = subscribeToTable<any>('habits', uid, (rows) => {
      set({ habits: rows.map(rowToHabit), loading: false });
    });
  },

  unsubscribe: () => {
    if (channel) channel.unsubscribe();
    channel = null;
    currentUid = null;
  },

  addHabit: async (input) => {
    if (!currentUid) return;
    await insertRow('habits', { ...habitToRow(currentUid, input), completions: [] });
  },

  editHabit: async (id, updates) => {
    if (!currentUid) return;
    await updateRow('habits', id, habitToRow(currentUid, updates));
  },

  toggleToday: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;
    const today = formatDateISO(new Date());
    const hasToday = habit.completions.includes(today);
    const completions = hasToday
      ? habit.completions.filter((d) => d !== today)
      : [...habit.completions, today];
    await updateRow('habits', id, { completions });
  },

  removeHabit: async (id) => {
    await deleteRow('habits', id);
  },

  reset: () => {
    set({ habits: [], loading: false, error: null });
  },
}));
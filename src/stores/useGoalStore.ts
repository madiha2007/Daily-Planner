import { create } from 'zustand';
import { Goal } from '@/lib/types';
import { subscribeToTable, insertRow, updateRow, deleteRow } from '@/lib/supabase/queries';
import { rowToGoal, goalToRow } from '@/lib/supabase/mappers';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchAll: () => void;
  subscribe: (uid: string) => void;
  unsubscribe: () => void;
  addGoal: (input: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  editGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  reset: () => void;
}

let channel: RealtimeChannel | null = null;
let currentUid: string | null = null;

export const useGoalStore = create<GoalState>()((set, get) => ({
  goals: [],
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
    channel = subscribeToTable<any>('goals', uid, (rows) => {
      set({ goals: rows.map(rowToGoal), loading: false });
    });
  },

  unsubscribe: () => {
    if (channel) channel.unsubscribe();
    channel = null;
    currentUid = null;
  },

  addGoal: async (input) => {
    if (!currentUid) return;
    await insertRow('goals', goalToRow(currentUid, input));
  },

  editGoal: async (id, updates) => {
    if (!currentUid) return;
    await updateRow('goals', id, goalToRow(currentUid, updates));
  },

  removeGoal: async (id) => {
    await deleteRow('goals', id);
  },

  reset: () => {
    set({ goals: [], loading: false, error: null });
  },
}));
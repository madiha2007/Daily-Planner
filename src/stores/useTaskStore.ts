import { create } from 'zustand';
import { Task } from '@/lib/types';
import { subscribeToTable, insertRow, updateRow, deleteRow } from '@/lib/supabase/queries';
import { rowToTask, taskToRow } from '@/lib/supabase/mappers';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchAll: () => void;
  subscribe: (uid: string) => void;
  unsubscribe: () => void;
  addTask: (input: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  editTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  reset: () => void;
}

let channel: RealtimeChannel | null = null;
let currentUid: string | null = null;

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchAll: () => {
    const uid = useAuthStore.getState().user?.id;
    if (uid) get().subscribe(uid);
  },

  subscribe: (uid) => {
    if (currentUid === uid && channel) return;
    if (channel) channel.unsubscribe();
    currentUid = uid;
    set({ loading: true, error: null });
    channel = subscribeToTable<any>('tasks', uid, (rows) => {
      set({ tasks: rows.map(rowToTask), loading: false });
    });
  },

  unsubscribe: () => {
    if (channel) channel.unsubscribe();
    channel = null;
    currentUid = null;
  },

  addTask: async (input) => {
    if (!currentUid) return;
    await insertRow('tasks', taskToRow(currentUid, input));
  },

  editTask: async (id, updates) => {
    if (!currentUid) return;
    await updateRow('tasks', id, taskToRow(currentUid, updates));
  },

  toggleTask: async (id) => {
    const current = get().tasks.find((t) => t.id === id);
    if (!current) return;
    await updateRow('tasks', id, { done: !current.done });
  },

  removeTask: async (id) => {
    await deleteRow('tasks', id);
  },

  reset: () => {
    set({ tasks: [], loading: false, error: null });
  },
}));
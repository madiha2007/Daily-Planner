import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task } from '@/lib/types';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/api/tasks';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addTask: (input: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  editTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,

      fetchAll: async () => {
        if (get().tasks.length > 0) return;
        set({ loading: true, error: null });
        try {
          const tasks = await fetchTasks();
          set({ tasks, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
        }
      },

      addTask: async (input) => {
        const task = await createTask(input);
        set({ tasks: [...get().tasks, task] });
      },

      editTask: async (id, updates) => {
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) });
        await updateTask(id, updates);
      },

      toggleTask: async (id) => {
        const current = get().tasks.find((t) => t.id === id);
        if (!current) return;
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) });
        await updateTask(id, { done: !current.done });
      },

      removeTask: async (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
        await deleteTask(id);
      },
    }),
    {
      name: 'daily-planner:tasks',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
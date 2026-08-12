import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Goal } from '@/lib/types';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '@/lib/api/goals';

interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addGoal: (input: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  editGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      loading: false,
      error: null,

      // fetchAll: async () => {
      //   if (get().goals.length > 0) return;
      //   set({ loading: true, error: null });
      //   try {
      //     const goals = await fetchGoals();
      //     set({ goals, loading: false });
      //   } catch (err) {
      //     set({ error: (err as Error).message, loading: false });
      //   }
      // },

      fetchAll: async () => {
  if (get().goals.length > 0) return;
  set({ loading: true, error: null });
  try {
    // No more mock seeding — starts empty, user adds real goals.
    set({ goals: [], loading: false });
  } catch (err) {
    set({ error: (err as Error).message, loading: false });
  }
},
      addGoal: async (input) => {
        const goal = await createGoal(input);
        set({ goals: [...get().goals, goal] });
      },

      editGoal: async (id, updates) => {
        set({ goals: get().goals.map((g) => (g.id === id ? { ...g, ...updates } : g)) });
        await updateGoal(id, updates);
      },

      removeGoal: async (id) => {
        set({ goals: get().goals.filter((g) => g.id !== id) });
        await deleteGoal(id);
      },
    }),
    {
      name: 'daily-planner:goals',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ goals: state.goals }),
    }
  )
);
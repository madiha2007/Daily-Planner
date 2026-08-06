import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Habit } from '@/lib/types';
import { fetchHabits, createHabit, updateHabit, toggleHabitToday, deleteHabit } from '@/lib/api/habits';

interface HabitState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addHabit: (input: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => Promise<void>;
  editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  toggleToday: (id: string) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      loading: false,
      error: null,

      fetchAll: async () => {
        if (get().habits.length > 0) return;
        set({ loading: true, error: null });
        try {
          const habits = await fetchHabits();
          set({ habits, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
        }
      },

      addHabit: async (input) => {
        const habit = await createHabit(input);
        set({ habits: [...get().habits, habit] });
      },

      editHabit: async (id, updates) => {
        const updated = await updateHabit(id, updates);
        set({ habits: get().habits.map((h) => (h.id === id ? updated : h)) });
      },

      toggleToday: async (id) => {
        const updated = await toggleHabitToday(id);
        set({ habits: get().habits.map((h) => (h.id === id ? updated : h)) });
      },

      removeHabit: async (id) => {
        set({ habits: get().habits.filter((h) => h.id !== id) });
        await deleteHabit(id);
      },
    }),
    {
      name: 'daily-planner:habits',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ habits: state.habits }),
    }
  )
);
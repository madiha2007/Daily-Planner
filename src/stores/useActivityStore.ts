import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DayActivity } from '@/lib/types';
import { fetchDayActivity } from '@/lib/api/activity';

interface ActivityState {
  days: DayActivity[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      days: [],
      loading: false,
      error: null,

      fetchAll: async () => {
        if (get().days.length > 0) return;
        set({ loading: true, error: null });
        try {
          const days = await fetchDayActivity(91);
          set({ days, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
        }
      },
    }),
    {
      name: 'daily-planner:activity',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ days: state.days }),
    }
  )
);
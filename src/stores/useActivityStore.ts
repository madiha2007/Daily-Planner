import { create } from 'zustand';
import { DayActivity } from '@/lib/types';
import { fetchDayActivity } from '@/lib/api/activity';

interface ActivityState {
  days: DayActivity[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  days: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const days = await fetchDayActivity(91);
      set({ days, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));

import { create } from 'zustand';

export type OverlayType =
  | 'addTask'
  | 'editTask'
  | 'deleteTask'
  | 'addHabit'
  | 'editHabit'
  | 'addJournal'
  | 'dayDetails'
  | 'analyticsBreakdown'
  | 'goalDetails'
  | 'profileSettings'
  | null;

interface OverlayState {
  activeOverlay: OverlayType;
  payload: unknown;
  open: (type: OverlayType, payload?: unknown) => void;
  close: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  activeOverlay: null,
  payload: null,
  open: (type, payload = null) => set({ activeOverlay: type, payload }),
  close: () => set({ activeOverlay: null, payload: null }),
}));

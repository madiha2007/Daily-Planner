import { create } from 'zustand';

interface UIState {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'overview',
  setActiveSection: (id) => set({ activeSection: id }),
}));

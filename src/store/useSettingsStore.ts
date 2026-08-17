import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hasSeenTutorial: boolean;
  setHasSeenTutorial: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      setHasSeenTutorial: (value: boolean) => set({ hasSeenTutorial: value }),
    }),
    {
      name: 'nodle-settings',
    }
  )
);

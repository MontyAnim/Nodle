import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hasSeenTutorial: boolean;
  setHasSeenTutorial: (value: boolean) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      setHasSeenTutorial: (value: boolean) => set({ hasSeenTutorial: value }),
      nickname: "",
      setNickname: (nickname: string) => set({ nickname: nickname.trim().slice(0, 20) }),
    }),
    {
      name: 'nodle-settings',
    }
  )
);

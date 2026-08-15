import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'es' | 'en';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'es', // Default language
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'nodle-locale-storage',
    }
  )
);

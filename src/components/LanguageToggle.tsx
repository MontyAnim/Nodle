"use client";

import { useLocaleStore } from "@/store/useLocaleStore";

export function LanguageToggle() {
  const { locale, setLocale } = useLocaleStore();

  return (
    <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 z-50">
      <button
        onClick={() => setLocale('es')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          locale === 'es' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          locale === 'en' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800'
        }`}
      >
        EN
      </button>
    </div>
  );
}

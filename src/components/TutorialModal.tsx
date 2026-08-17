"use client";

import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/store/useSettingsStore";
import { HelpCircle, X, Check, Search, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function TutorialModal() {
  const t = useTranslations("Tutorial");
  const { hasSeenTutorial, setHasSeenTutorial } = useSettingsStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (hasSeenTutorial) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/20">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <HelpCircle className="w-5 h-5 text-violet-500" />
            <h2 className="font-semibold text-lg">{t('title')}</h2>
          </div>
          <button
            onClick={() => setHasSeenTutorial(true)}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {t('description')}
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{t('color_green')}</span> {t('exact_match')}
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                <span className="font-bold text-amber-600 dark:text-amber-400">{t('color_yellow')}</span> {t('partial_match')}
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold shrink-0 border border-zinc-300 dark:border-zinc-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">{t('color_gray')}</span> {t('no_match')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setHasSeenTutorial(true)}
            className="w-full mt-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg transition-colors"
          >
            {t('play_button')}
          </button>
        </div>
      </div>
    </div>
  );
}

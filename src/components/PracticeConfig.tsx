"use client";

import { useState } from "react";
import { AVAILABLE_SOFTWARE, AvailableSoftware, PracticeFilter } from "@/lib/daily";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface PracticeConfigProps {
  filter: PracticeFilter;
  onChange: (filter: PracticeFilter) => void;
  nodeCount: number;
}

const SOFTWARE_ICONS: Record<string, string> = {
  "Blender": "🟧",
  "Unreal Engine": "🎮",
  "Unity": "⬜",
  "Houdini": "🌀",
  "Substance Designer": "🟫",
};

export function PracticeConfig({ filter, onChange, nodeCount }: PracticeConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Game');

  const TIER_LABELS: Record<number, { label: string; description: string; color: string }> = {
    1: { label: "Tier 1", description: t('tier1_desc'), color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
    2: { label: "Tier 2", description: t('tier2_desc'), color: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
    3: { label: "Tier 3", description: t('tier3_desc'), color: "text-rose-400 border-rose-500/40 bg-rose-500/10" },
  };

  const setSoftware = (software: AvailableSoftware | null) => {
    onChange({ ...filter, software });
  };

  const setTier = (tier: 1 | 2 | 3 | null) => {
    onChange({ ...filter, tier });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Config toggle button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-white transition-colors mb-3 mx-auto"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t('filters')}
        {(filter.software || filter.tier) && (
          <span className="ml-1 px-1.5 py-0.5 bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs rounded-full">
            {[filter.software, filter.tier ? `T${filter.tier}` : null].filter(Boolean).join(" · ")}
          </span>
        )}
        <span className="text-xs text-zinc-600">({nodeCount} {t('nodes')})</span>
      </button>

      {isOpen && (
        <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 mb-4 backdrop-blur-sm">
          {/* Software filter */}
          <div>
            <p className="text-xs text-zinc-950 dark:text-zinc-500 uppercase tracking-widest mb-2">Software</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSoftware(null)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  filter.software === null
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500 hover:text-white"
                }`}
              >
                Todos
              </button>
              {AVAILABLE_SOFTWARE.map((sw) => (
                <button
                  key={sw}
                  onClick={() => setSoftware(sw)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                    filter.software === sw
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {SOFTWARE_ICONS[sw]} {sw}
                </button>
              ))}
            </div>
          </div>

          {/* Tier filter */}
          <div>
            <p className="text-xs text-zinc-950 dark:text-zinc-500 uppercase tracking-widest mb-2">Dificultad (Tier)</p>
            <div className="flex gap-2">
              <button
                onClick={() => setTier(null)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                  filter.tier === null
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500 hover:text-white"
                }`}
              >
                Todos
              </button>
              {([1, 2, 3] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                    filter.tier === t
                      ? `border ${TIER_LABELS[t].color}`
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {TIER_LABELS[t].label}
                  <span className="block text-[10px] opacity-70">{TIER_LABELS[t].description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

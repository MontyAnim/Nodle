"use client";

import * as React from "react";
import { Eye } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTranslations } from "next-intl";
import { Tooltip } from "./Tooltip";

export function ColorblindToggle() {
  const { colorblindMode, toggleColorblindMode } = useSettingsStore();
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations("Game");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const label = `${t("colorblind_mode")}${colorblindMode ? " (ON)" : ""}`;

  return (
    <Tooltip content={label} side="bottom">
      <button
        onClick={toggleColorblindMode}
        className={`p-2 rounded-full transition-all flex items-center justify-center group relative border ${
          colorblindMode
            ? "bg-[#0070B8]/15 border-[#0070B8]/40 text-[#0070B8] dark:text-[#38bdf8]"
            : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }`}
        aria-label={label}
        aria-pressed={colorblindMode}
      >
        <Eye className={`w-4 h-4 transition-transform group-hover:scale-110 ${colorblindMode ? "stroke-[2.5]" : ""}`} />
        {colorblindMode && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#0070B8] rounded-full ring-2 ring-white dark:ring-zinc-950" />
        )}
      </button>
    </Tooltip>
  );
}

"use client";

import * as React from "react";
import { User } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTranslations } from "next-intl";
import { NicknameModal } from "./NicknameModal";

export function NicknameToggle() {
  const { nickname } = useSettingsStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations("Profile");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all flex items-center gap-1.5 group text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
        title={t("title")}
        aria-label={t("title")}
      >
        <User className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
        <span className="max-w-[100px] truncate hidden md:inline font-semibold">
          {nickname || t("set_nickname")}
        </span>
      </button>

      <NicknameModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

"use client";

import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { FeedbackModal } from "./FeedbackModal";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Feedback");

  return (
    <>
      <button
        id="feedback-button"
        onClick={() => setIsOpen(true)}
        title={t("button_tooltip")}
        aria-label={t("button_tooltip")}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-white border border-zinc-700 dark:border-zinc-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group text-sm font-medium"
      >
        <MessageSquarePlus className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
        <span className="hidden sm:inline">{t("button_tooltip")}</span>
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

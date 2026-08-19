"use client";

import React, { useState, useEffect } from "react";
import { X, User, Check, Sparkles } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTranslations } from "next-intl";
import { Tooltip } from "./Tooltip";

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NicknameModal({ isOpen, onClose }: NicknameModalProps) {
  const { nickname, setNickname } = useSettingsStore();
  const [value, setValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const t = useTranslations("Profile");

  useEffect(() => {
    if (isOpen) {
      setValue(nickname || "");
      setIsSaved(false);
    }
  }, [isOpen, nickname]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNickname(value);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-base">{t("title")}</h2>
          </div>
          <Tooltip content="Close" side="bottom">
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("description")}
          </p>

          <div>
            <label
              htmlFor="player-nickname"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2"
            >
              {t("nickname_label")}
            </label>
            <div className="relative">
              <input
                id="player-nickname"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={20}
                placeholder={t("nickname_placeholder")}
                autoFocus
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              />
              <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-mono">
                {value.length}/20
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaved}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg disabled:opacity-75"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 animate-scale-in" />
                  <span>{t("saved")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t("save")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

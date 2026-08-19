"use client";

import React, { useState } from "react";
import { X, Bug, Loader2, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const t = useTranslations("Feedback");

  const [category, setCategory] = useState<"bug" | "suggestion" | "other">("bug");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleClose = () => {
    if (status === "submitting") return;
    setDescription("");
    setContact("");
    setCategory("bug");
    setStatus("idle");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");

    const metadata = {
      url: window.location.href,
      language: navigator.language,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description, contact, metadata }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  const categoryOptions = [
    { value: "bug" as const, label: t("category_bug") },
    { value: "suggestion" as const, label: t("category_suggestion") },
    { value: "other" as const, label: t("category_other") },
  ];

  const categoryColor = {
    bug: "border-rose-500/50 bg-rose-500/10 text-rose-400",
    suggestion: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
    other: "border-sky-500/50 bg-sky-500/10 text-sky-400",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Bug className="w-5 h-5 text-rose-400" />
            <h2 className="font-semibold text-base">{t("title")}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{t("success_title")}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">{t("success_message")}</p>
              <button
                onClick={handleClose}
                className="mt-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-xl transition-colors text-sm"
              >
                {t("close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("subtitle")}</p>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  {t("category_label")}
                </label>
                <div className="flex gap-2">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`flex-1 py-2 px-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                        category === opt.value
                          ? categoryColor[opt.value]
                          : "border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="feedback-description"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2"
                >
                  {t("description_label")}
                </label>
                <textarea
                  id="feedback-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={5}
                  rows={4}
                  placeholder={t("description_placeholder")}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-colors resize-none"
                />
              </div>

              {/* Contact (optional) */}
              <div>
                <label
                  htmlFor="feedback-contact"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2"
                >
                  {t("contact_label")}
                </label>
                <input
                  id="feedback-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={t("contact_placeholder")}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-colors"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="text-sm text-rose-400 text-center">{t("error_message")}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "submitting" || description.trim().length < 5}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

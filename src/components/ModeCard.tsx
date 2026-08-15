import Link from "next/link";
import { LucideIcon } from "lucide-react";
import React from "react";

interface ModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  colorClass: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

export function ModeCard({
  title,
  description,
  icon: Icon,
  href,
  colorClass,
  disabled = false,
  comingSoon = false,
}: ModeCardProps) {
  const content = (
    <div
      className={`relative h-full flex flex-col p-6 rounded-2xl border transition-all duration-200 ${
        disabled
          ? "bg-zinc-50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800/30 opacity-60 cursor-not-allowed"
          : `bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:bg-zinc-800/80 hover:-translate-y-1 hover:shadow-xl ${colorClass}`
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${
            disabled ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-500" : "bg-zinc-100 dark:bg-zinc-800/50"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {comingSoon && (
          <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
            Pronto
          </span>
        )}
      </div>

      <h3
        className={`text-lg font-bold mb-2 ${
          disabled ? "text-zinc-950 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );

  if (disabled) {
    return <div className="h-full">{content}</div>;
  }

  return (
    <Link href={href} className="h-full block focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-2xl">
      {content}
    </Link>
  );
}

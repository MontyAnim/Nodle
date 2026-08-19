"use client";

import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({ content, children, side = "bottom", className = "" }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-zinc-800 dark:border-t-zinc-100 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 dark:border-b-zinc-100 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-zinc-800 dark:border-l-zinc-100 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-zinc-800 dark:border-r-zinc-100 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div className={`relative group/tooltip inline-flex ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`
          pointer-events-none absolute z-[100] whitespace-nowrap
          px-2.5 py-1.5 rounded-lg text-xs font-medium leading-none
          bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900
          shadow-lg shadow-black/20
          opacity-0 scale-95 translate-y-0
          group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100
          transition-all duration-150 ease-out
          ${positionClasses[side]}
        `}
      >
        {content}
        <span
          className={`absolute border-4 ${arrowClasses[side]}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

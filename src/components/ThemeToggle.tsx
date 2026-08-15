"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-100 transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-950 dark:text-zinc-500 group-hover:text-zinc-900 transition-colors" />
      )}
    </button>
  );
}

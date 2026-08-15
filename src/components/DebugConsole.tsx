import React, { useState, useEffect } from 'react';
import { useClassicStore } from '@/store/useGameStore';
import { NodeData } from '@/types/node';
import { getUTCDayIndex } from '@/lib/daily';

interface DebugConsoleProps {
  targetNode: NodeData | null;
}

export function DebugConsole({ targetNode }: DebugConsoleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const debugDayOverride = useClassicStore((state) => state.debugDayOverride);
  const setDebugDayOverride = useClassicStore((state) => state.setDebugDayOverride);
  const addAttempt = useClassicStore((state) => state.addAttempt);
  const gameStatus = useClassicStore((state) => state.gameStatus);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  const currentDay = debugDayOverride ?? getUTCDayIndex();

  const handleClearStorage = () => {
    localStorage.removeItem('nodle-storage');
    window.location.reload();
  };

  const handleAutoWin = () => {
    if (targetNode && gameStatus !== 'won' && gameStatus !== 'lost') {
      addAttempt(targetNode.id);
    }
  };

  const handleChangeDay = (offset: number) => {
    setDebugDayOverride(currentDay + offset);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-green-500/30 p-4 rounded-lg shadow-2xl backdrop-blur-sm font-mono text-xs text-green-400 w-80">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-green-500/20">
        <h3 className="font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          DEBUG CONSOLE
        </h3>
        <button onClick={() => setIsVisible(false)} className="text-zinc-950 dark:text-zinc-500 hover:text-white">✕</button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-zinc-950 dark:text-zinc-500 mb-1">Target Node</div>
          <div className="bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-yellow-300 truncate">
            {targetNode ? `${targetNode.name} (${targetNode.software})` : 'Cargando...'}
          </div>
        </div>

        <div>
          <div className="text-zinc-950 dark:text-zinc-500 mb-1">Time Machine (Day: {currentDay})</div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleChangeDay(-1)}
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 py-1 rounded transition-colors"
            >
              -1 Día
            </button>
            <button 
              onClick={() => handleChangeDay(1)}
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 py-1 rounded transition-colors"
            >
              +1 Día
            </button>
          </div>
        </div>

        <div>
          <div className="text-zinc-950 dark:text-zinc-500 mb-1">Quick Actions</div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleAutoWin}
              className="w-full bg-green-900/30 hover:bg-green-900/50 border border-green-700 py-1.5 rounded transition-colors"
            >
              Forzar Victoria (Auto-Win)
            </button>
            <button 
              onClick={handleClearStorage}
              className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-700 py-1.5 rounded transition-colors text-red-400"
            >
              Limpiar Caché (Reset)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

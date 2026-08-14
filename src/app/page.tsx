"use client";

import { useEffect, useState } from "react";
import { Box } from "lucide-react";
import { useGameStore } from "../store/useGameStore";
import { getNodes } from "@/lib/nodes";
import { getUTCDayIndex, getDailyTargetNode } from "@/lib/daily";
import { NodeData } from "@/types/node";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  const resetDailyGame = useGameStore((state) => state.resetDailyGame);
  const lastPlayedTimestamp = useGameStore((state) => state.lastPlayedTimestamp);
  const hardMode = useGameStore((state) => state.hardMode);
  const toggleHardMode = useGameStore((state) => state.toggleHardMode);

  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [dailyNode, setDailyNode] = useState<NodeData | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Forzar persistencia inicial
    useGameStore.setState(useGameStore.getState());

    const currentDay = getUTCDayIndex();

    // Check if we need to reset the game
    if (lastPlayedTimestamp !== currentDay) {
      resetDailyGame(currentDay);
    }

    // Probar carga perezosa y PRNG
    getNodes().then((nodes) => {
      setAllNodes(nodes);
      
      const target = getDailyTargetNode(nodes, currentDay);
      setDailyNode(target);
      setIsReady(true);
    });
  }, [lastPlayedTimestamp, resetDailyGame]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center font-sans text-sm flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Box className="w-12 h-12 text-zinc-50" />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-center">
            Nodle
          </h1>
        </div>
        <p className="text-lg text-zinc-400 text-center max-w-xl">
          El juego de deducción lógica basado en nodos para artistas técnicos y desarrolladores de videojuegos.
        </p>

        <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
          <span className="text-sm text-zinc-400 font-medium">Modo Difícil</span>
          <button 
            onClick={toggleHardMode}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${hardMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
          >
            <span className={`w-4 h-4 bg-white rounded-full absolute shadow transition-transform ${hardMode ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
        
        {isReady && (
          <div className="w-full max-w-xl mt-4">
            <SearchBar nodes={allNodes} target={dailyNode} />
          </div>
        )}

        {/* Placeholder for the game board */}
        <div className="w-full max-w-2xl p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-xl flex flex-col items-center justify-center min-h-64 mt-4">
          <p className="text-center text-zinc-500 italic">Tablero de deducción próximamente...</p>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Box } from "lucide-react";
import { useGameStore } from "../store/useGameStore";
import { getNodes } from "@/lib/nodes";
import { getUTCDayIndex, getDailyTargetNode } from "@/lib/daily";
import { NodeData } from "@/types/node";

export default function Home() {
  const resetDailyGame = useGameStore((state) => state.resetDailyGame);
  const lastPlayedTimestamp = useGameStore((state) => state.lastPlayedTimestamp);

  const [nodeCount, setNodeCount] = useState<number | null>(null);
  const [dailyNode, setDailyNode] = useState<NodeData | null>(null);

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
      setNodeCount(nodes.length);
      
      const target = getDailyTargetNode(nodes, currentDay);
      setDailyNode(target);
    });
  }, [lastPlayedTimestamp, resetDailyGame]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-sans text-sm flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Box className="w-12 h-12 text-zinc-50" />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-center">
            Nodle
          </h1>
        </div>
        {nodeCount !== null && (
          <div className="mt-4 px-4 py-2 bg-emerald-900/30 text-emerald-400 rounded-md border border-emerald-800 font-mono text-center">
            ✅ {nodeCount} nodos cargados asíncronamente
            {dailyNode && (
              <div className="mt-2 text-emerald-500/50 text-xs">
                (Motor PRNG iniciado y nodo diario seleccionado en secreto)
              </div>
            )}
          </div>
        )}
        <p className="text-lg text-zinc-400 text-center max-w-xl">
          El juego de deducción lógica basado en nodos para artistas técnicos y desarrolladores de videojuegos.
        </p>
        
        {/* Placeholder for the game board */}
        <div className="w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl flex flex-col items-center justify-center min-h-64">
          <p className="text-center text-zinc-500 italic">Tablero de deducción próximamente...</p>
        </div>
      </div>
    </main>
  );
}

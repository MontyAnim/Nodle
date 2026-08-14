"use client";

import { useEffect } from "react";
import { Box } from "lucide-react";
import { useGameStore } from "../store/useGameStore";

export default function Home() {
  // Forzar la persistencia en localStorage en el primer render
  useEffect(() => {
    useGameStore.setState(useGameStore.getState());
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-sans text-sm flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Box className="w-12 h-12 text-zinc-50" />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-center">
            Nodle
          </h1>
        </div>
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

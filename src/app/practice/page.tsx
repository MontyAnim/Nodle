"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Box, RefreshCw, Trophy } from "lucide-react";
import { getNodes } from "@/lib/nodes";
import { getRandomNode, PracticeFilter } from "@/lib/daily";
import { NodeData } from "@/types/node";
import { SearchBar } from "@/components/SearchBar";
import { GameBoard } from "@/components/GameBoard";
import { PracticeConfig } from "@/components/PracticeConfig";
import { useGameStore } from "@/store/useGameStore";
import { DebugConsole } from "@/components/DebugConsole";

const MAX_ATTEMPTS = 6;

export default function PracticePage() {
  const colorblindMode = useGameStore((state) => state.colorblindMode);

  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [targetNode, setTargetNode] = useState<NodeData | null>(null);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [isReady, setIsReady] = useState(false);
  const [roundCount, setRoundCount] = useState(1);
  const [wins, setWins] = useState(0);

  const [filter, setFilter] = useState<PracticeFilter>({
    software: null,
    tier: null,
  });

  // Load all nodes on mount
  useEffect(() => {
    getNodes().then((nodes) => {
      setAllNodes(nodes);
      setIsReady(true);
    });
  }, []);

  // Pick a new random node whenever allNodes or filter changes (and game is in initial state)
  useEffect(() => {
    if (allNodes.length === 0) return;
    const node = getRandomNode(allNodes, filter);
    setTargetNode(node);
    setAttempts([]);
    setGameStatus("playing");
  }, [allNodes, filter]);

  const poolSize = useMemo(() => {
    let pool = [...allNodes];
    if (filter.software) pool = pool.filter((n) => n.software === filter.software);
    if (filter.tier !== null) pool = pool.filter((n) => n.frequency_tier === filter.tier);
    return pool.length;
  }, [allNodes, filter]);

  const attemptNodes = useMemo(
    () =>
      attempts
        .map((id) => allNodes.find((n) => n.id === id))
        .filter((n): n is NodeData => n !== undefined),
    [attempts, allNodes]
  );

  const handleAttempt = useCallback(
    (nodeId: string) => {
      if (gameStatus !== "playing") return;

      const newAttempts = [...attempts, nodeId];
      setAttempts(newAttempts);

      if (nodeId === targetNode?.id) {
        setGameStatus("won");
        setWins((w) => w + 1);
      } else if (newAttempts.length >= MAX_ATTEMPTS) {
        setGameStatus("lost");
      }
    },
    [attempts, gameStatus, targetNode]
  );

  const handleNextRound = () => {
    const node = getRandomNode(allNodes, filter);
    setTargetNode(node);
    setAttempts([]);
    setGameStatus("playing");
    setRoundCount((r) => r + 1);
  };

  const handleFilterChange = (newFilter: PracticeFilter) => {
    setFilter(newFilter);
    // Reset game immediately when filter changes
    const node = getRandomNode(allNodes, newFilter);
    setTargetNode(node);
    setAttempts([]);
    setGameStatus("playing");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 bg-background text-foreground pb-32">
      <div className="z-10 max-w-5xl w-full items-center font-sans text-sm flex flex-col gap-6">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Reto Diario
          </Link>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold">{wins}</span>
            <span>victorias · Ronda {roundCount}</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Box className="w-10 h-10 text-violet-400" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="text-violet-400">Modo</span> Práctica
            </h1>
          </div>
          <p className="text-zinc-400 text-center max-w-md text-sm">
            Practica sin límite. Los resultados <strong className="text-zinc-300">no</strong> afectan tu racha ni el Leaderboard diario.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs text-violet-300 font-medium">Endless Mode activo</span>
          </div>
        </div>

        {/* Filter config */}
        {isReady && (
          <PracticeConfig
            filter={filter}
            onChange={handleFilterChange}
            nodeCount={poolSize}
          />
        )}

        {/* Game area */}
        {isReady && targetNode ? (
          <>
            <div className="w-full max-w-xl z-20">
              <SearchBar
                nodes={allNodes}
                target={targetNode}
                onAttempt={handleAttempt}
                disabled={gameStatus !== "playing"}
              />
            </div>

            <GameBoard
              attempts={attemptNodes}
              target={targetNode}
              colorblindMode={colorblindMode}
            />

            {/* End of round */}
            {gameStatus !== "playing" && (
              <div className="flex flex-col items-center gap-3 mt-4 animate-fade-in">
                {gameStatus === "won" ? (
                  <p className="text-emerald-400 font-bold text-lg">
                    ¡Correcto! Era <span className="underline">{targetNode.name}</span>
                  </p>
                ) : (
                  <p className="text-rose-400 font-bold text-lg">
                    Era <span className="underline">{targetNode.name}</span> de {targetNode.software}
                  </p>
                )}
                <button
                  onClick={handleNextRound}
                  className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-bold transition-colors shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  Siguiente Nodo
                </button>
              </div>
            )}
          </>
        ) : isReady && !targetNode ? (
          <div className="text-center text-zinc-500 mt-8">
            <p>No hay nodos con estos filtros. Prueba una combinación diferente.</p>
          </div>
        ) : (
          <div className="text-center text-zinc-600 mt-8">Cargando nodos...</div>
        )}

        <DebugConsole targetNode={targetNode} />
      </div>
    </main>
  );
}

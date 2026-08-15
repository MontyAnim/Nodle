"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Box } from "lucide-react";
import { useGameStore } from "../store/useGameStore";
import { getNodes } from "@/lib/nodes";
import { getUTCDayIndex, getDailyTargetNode } from "@/lib/daily";
import { NodeData } from "@/types/node";
import { SearchBar } from "@/components/SearchBar";
import { GameBoard } from "@/components/GameBoard";
import { DebugConsole } from "@/components/DebugConsole";
import { generateShareImage, copyShareImageToClipboard } from "@/lib/canvas";
import { Share2, Check } from "lucide-react";
import { KofiButton } from "@/components/KofiButton";
import { EthicalAd } from "@/components/EthicalAd";
import { usePostHog } from "posthog-js/react";

export default function Home() {
  const resetDailyGame = useGameStore((state) => state.resetDailyGame);
  const lastPlayedTimestamp = useGameStore((state) => state.lastPlayedTimestamp);
  const attempts = useGameStore((state) => state.attempts);
  const hardMode = useGameStore((state) => state.hardMode);
  const toggleHardMode = useGameStore((state) => state.toggleHardMode);
  const colorblindMode = useGameStore((state) => state.colorblindMode);
  const toggleColorblindMode = useGameStore((state) => state.toggleColorblindMode);
  const debugDayOverride = useGameStore((state) => state.debugDayOverride);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const userId = useGameStore((state) => state.userId);
  const dailyStartTime = useGameStore((state) => state.dailyStartTime);

  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [dailyNode, setDailyNode] = useState<NodeData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    useGameStore.setState(useGameStore.getState());
    const currentDay = debugDayOverride ?? getUTCDayIndex();
    if (lastPlayedTimestamp !== currentDay) {
      resetDailyGame(currentDay);
    }
    getNodes().then((nodes) => {
      setAllNodes(nodes);
      const target = getDailyTargetNode(nodes, currentDay);
      setDailyNode(target);
      setIsReady(true);
    });
  }, [lastPlayedTimestamp, resetDailyGame, debugDayOverride]);

  // Chequear victoria o derrota y enviar al leaderboard
  useEffect(() => {
    if (!dailyNode || attempts.length === 0) return;
    const lastAttemptId = attempts[attempts.length - 1];
    
    if (lastAttemptId === dailyNode.id) {
      if (gameStatus !== 'won') {
        console.log("[Leaderboard] Victory detected! userId:", userId, "dailyStartTime:", dailyStartTime);
        setGameStatus('won');
        
        posthog?.capture("game_completed", {
          mode: "daily",
          status: "won",
          attempts_used: attempts.length,
          target_node_id: dailyNode.id,
          target_node_name: dailyNode.name
        });
        
        // Fallback en caso de estado obsoleto
        const safeUserId = userId || "anonymous-" + Math.floor(Math.random() * 10000);
        const safeStartTime = dailyStartTime || (Date.now() - 30000); // Asumir 30 segundos si falta
        const timeMs = Date.now() - safeStartTime;

        fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: safeUserId,
            dayIndex: getUTCDayIndex(),
            timeMs,
            attempts: attempts.length
          })
        }).then(res => {
          console.log("[Leaderboard] API Response:", res.status);
        }).catch(err => {
          console.error("[Leaderboard] Fetch error:", err);
        });
      }
    } else if (attempts.length >= 6) {
      if (gameStatus !== 'lost') {
        setGameStatus('lost');
        posthog?.capture("game_completed", {
          mode: "daily",
          status: "lost",
          attempts_used: 6,
          target_node_id: dailyNode.id,
          target_node_name: dailyNode.name
        });
      }
    }
  }, [attempts, dailyNode, gameStatus, setGameStatus, userId, dailyStartTime]);

  const attemptNodes = useMemo(() => {
    return attempts
      .map(id => allNodes.find(n => n.id === id))
      .filter((n): n is NodeData => n !== undefined);
  }, [attempts, allNodes]);

  const handleShare = async () => {
    if (dailyNode) {
      const success = await copyShareImageToClipboard(attemptNodes, dailyNode, colorblindMode);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert("Tu navegador no soporta copiar imágenes al portapapeles directamente. ¡Usa el teléfono o un navegador moderno!");
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 bg-background text-foreground pb-32">
      <div className="z-10 max-w-5xl w-full items-center font-sans text-sm flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Box className="w-12 h-12 text-zinc-50" />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-center">
            Nodle
          </h1>
        </div>
        <p className="text-lg text-zinc-400 text-center max-w-xl">
          El juego de deducción lógica basado en nodos para artistas técnicos y desarrolladores de videojuegos.
        </p>

        {/* Navigation to Practice Mode */}
        <Link
          href="/practice"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/30 hover:border-violet-500/60 text-violet-300 rounded-full text-sm font-medium transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          Modo Práctica — Practica sin límite
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
            <span className="text-sm text-zinc-400 font-medium">Modo Difícil</span>
            <button 
              onClick={toggleHardMode}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${hardMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
            >
              <span className={`w-4 h-4 bg-white rounded-full absolute shadow transition-transform ${hardMode ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
            <span className="text-sm text-zinc-400 font-medium">Modo Daltónico</span>
            <button 
              onClick={toggleColorblindMode}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${colorblindMode ? 'bg-[#0070B8]' : 'bg-zinc-700'}`}
            >
              <span className={`w-4 h-4 bg-white rounded-full absolute shadow transition-transform ${colorblindMode ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        
        {isReady && (
          <div className="w-full max-w-xl mt-2 z-20">
            <SearchBar nodes={allNodes} target={dailyNode} />
          </div>
        )}

        {isReady && dailyNode && (
          <GameBoard attempts={attemptNodes} target={dailyNode} colorblindMode={colorblindMode} />
        )}

        {isReady && attempts.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-colors shadow-lg"
            >
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {copied ? '¡Copiado al Portapapeles!' : 'Compartir Resultado'}
            </button>
            {gameStatus === 'won' && (
              <div className="animate-fade-in flex flex-col items-center gap-2 mt-4">
                <p className="text-zinc-400 text-sm">¿Te gusta Nodle?</p>
                <KofiButton />
              </div>
            )}
          </div>
        )}

        <DebugConsole targetNode={dailyNode} />
      </div>

      {/* Ethical Ads Integration */}
      <div className="w-full max-w-3xl mt-12">
        <EthicalAd />
      </div>

      {/* Global Footer */}
      <footer className="mt-12 flex flex-col items-center justify-center gap-4 text-center border-t border-zinc-800/50 pt-8 w-full max-w-5xl">
        <p className="text-zinc-500 text-sm">
          Creado con ♥ para la comunidad de Technical Artists.
        </p>
        <KofiButton label="Invítame un café" className="text-xs px-3 py-1.5" />
      </footer>
    </main>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Box, ArrowLeft, Boxes, Share2, Check, Trophy } from "lucide-react";
import { useUnityStore } from "@/store/useGameStore";
import { getNodes } from "@/lib/nodes";
import { getUTCDayIndex, getDailyTargetNode, MODES_CONFIG } from "@/lib/daily";
import { NodeData } from "@/types/node";
import { SearchBar } from "@/components/SearchBar";
import { GameBoard } from "@/components/GameBoard";
import { DebugConsole } from "@/components/DebugConsole";
import { generateShareImage, copyShareImageToClipboard } from "@/lib/canvas";
import { KofiButton } from "@/components/KofiButton";
import { EthicalAd } from "@/components/EthicalAd";
import { usePostHog } from "posthog-js/react";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { triggerVictoryConfetti } from "@/lib/confetti";

export default function UnityDaily() {
  const resetDailyGame = useUnityStore((state) => state.resetDailyGame);
  const lastPlayedTimestamp = useUnityStore((state) => state.lastPlayedTimestamp);
  const attempts = useUnityStore((state) => state.attempts);
  const addAttempt = useUnityStore((state) => state.addAttempt);
  const hardMode = useUnityStore((state) => state.hardMode);
  const toggleHardMode = useUnityStore((state) => state.toggleHardMode);
  const colorblindMode = useUnityStore((state) => state.colorblindMode);
  const toggleColorblindMode = useUnityStore((state) => state.toggleColorblindMode);
  const debugDayOverride = useUnityStore((state) => state.debugDayOverride);
  const gameStatus = useUnityStore((state) => state.gameStatus);
  const setGameStatus = useUnityStore((state) => state.setGameStatus);
  const userId = useUnityStore((state) => state.userId);
  const dailyStartTime = useUnityStore((state) => state.dailyStartTime);

  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [unityNodes, setunityNodes] = useState<NodeData[]>([]);
  const [dailyNode, setDailyNode] = useState<NodeData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    useUnityStore.setState(useUnityStore.getState());
    const currentDay = debugDayOverride ?? getUTCDayIndex();
    if (lastPlayedTimestamp !== currentDay) {
      resetDailyGame(currentDay);
    }
    getNodes().then((nodes) => {
      setAllNodes(nodes);
      const filtered = nodes.filter(MODES_CONFIG.unity.filter);
      setunityNodes(filtered);
      
      const target = getDailyTargetNode(nodes, currentDay, MODES_CONFIG.unity);
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
        console.log("[Leaderboard Unity] Victory detected! userId:", userId, "dailyStartTime:", dailyStartTime);
        setGameStatus('won');
        
        triggerVictoryConfetti();
        
        posthog?.capture("game_completed", {
          mode: "unity",
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
          mode: "unity",
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start text-sm font-medium -ml-2 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Hub
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Boxes className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-600 dark:text-zinc-400" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Nodle
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-medium">Reto Diario Unity</p>
        </div>

        {/* Navigation to Leaderboard */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/30 hover:border-zinc-500/60 text-zinc-600 dark:text-zinc-400 rounded-full text-sm font-medium transition-all"
          >
            <Trophy className="w-4 h-4" />
            Ver Leaderboard
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Modo Difícil</span>
            <button 
              onClick={toggleHardMode}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${hardMode ? 'bg-zinc-500' : 'bg-zinc-700'}`}
            >
              <span className={`w-4 h-4 bg-white rounded-full absolute shadow transition-transform ${hardMode ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Modo Daltónico</span>
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
            <SearchBar 
              nodes={unityNodes} 
              target={dailyNode} 
              onAttempt={addAttempt}
              attempts={attempts}
              hardMode={hardMode}
            />
          </div>
        )}

        {isReady && dailyNode && (
          <GameBoard attempts={attemptNodes} target={dailyNode} colorblindMode={colorblindMode} />
        )}

        {isReady && attempts.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-600 hover:bg-zinc-500 text-white rounded-full font-bold transition-colors shadow-lg"
            >
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {copied ? '¡Copiado al Portapapeles!' : 'Compartir Resultado'}
            </button>
            {gameStatus === 'won' && (
              <div className="animate-fade-in flex flex-col items-center gap-2 mt-4">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">¿Te gusta Nodle?</p>
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
      <footer className="mt-12 flex flex-col items-center justify-center gap-4 text-center border-t border-zinc-200 dark:border-zinc-800/50 pt-8 w-full max-w-5xl">
        <p className="text-zinc-950 dark:text-zinc-500 text-sm">
          Creado con ♥ para la comunidad de Technical Artists.
        </p>
        <KofiButton label="Invítame un café" className="text-xs px-3 py-1.5" />
      </footer>

      {/* Leaderboard Modal */}
      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
        dayIndex={getUTCDayIndex()} 
        currentUserId={userId || undefined}
      />
    </div>
  );
}

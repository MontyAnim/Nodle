"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Box, ArrowLeft, Boxes, Share2, Check, Trophy } from "lucide-react";
import { useTier2Store } from "@/store/useGameStore";
import { getNodes } from "@/lib/nodes";
import { getUTCDayIndex, getDailyTargetNode, MODES_CONFIG } from "@/lib/daily";
import { NodeData } from "@/types/node";
import { SearchBar } from "@/components/SearchBar";
import { GameBoard } from "@/components/GameBoard";
import { DebugConsole } from "@/components/DebugConsole";
import { generateShareImage, copyShareImageToClipboard } from "@/lib/canvas";
import { generateEmojiGridText } from "@/lib/share";
import { KofiButton } from "@/components/KofiButton";
import { Image as ImageIcon, AlignLeft } from "lucide-react";
import { EthicalAd } from "@/components/EthicalAd";
import { usePostHog } from "posthog-js/react";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { GameStatsPanel } from "@/components/GameStatsPanel";
import { triggerVictoryConfetti } from "@/lib/confetti";

export default function Tier2Daily() {
  const t = useTranslations('Game');
  const tHub = useTranslations('Hub');
  const tKofi = useTranslations('Kofi');
  const resetDailyGame = useTier2Store((state) => state.resetDailyGame);
  const lastPlayedTimestamp = useTier2Store((state) => state.lastPlayedTimestamp);
  const attempts = useTier2Store((state) => state.attempts);
  const addAttempt = useTier2Store((state) => state.addAttempt);
  const hardMode = useTier2Store((state) => state.hardMode);
  const toggleHardMode = useTier2Store((state) => state.toggleHardMode);
  const colorblindMode = useTier2Store((state) => state.colorblindMode);
  const toggleColorblindMode = useTier2Store((state) => state.toggleColorblindMode);
  const debugDayOverride = useTier2Store((state) => state.debugDayOverride);
  const gameStatus = useTier2Store((state) => state.gameStatus);
  const setGameStatus = useTier2Store((state) => state.setGameStatus);
  const userId = useTier2Store((state) => state.userId);
  const dailyStartTime = useTier2Store((state) => state.dailyStartTime);
  const currentStreak = useTier2Store((state) => state.currentStreak);
  const maxStreak = useTier2Store((state) => state.maxStreak);
  const winDistribution = useTier2Store((state) => state.winDistribution);

  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [tier2Nodes, setTier2Nodes] = useState<NodeData[]>([]);
  const [dailyNode, setDailyNode] = useState<NodeData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    useTier2Store.setState(useTier2Store.getState());
    const currentDay = debugDayOverride ?? getUTCDayIndex();
    if (lastPlayedTimestamp !== currentDay) {
      resetDailyGame(currentDay);
    }
    getNodes().then((nodes) => {
      setAllNodes(nodes);
      const filtered = nodes.filter(MODES_CONFIG.tier2.filter);
      setTier2Nodes(filtered);
      
      const target = getDailyTargetNode(nodes, currentDay, MODES_CONFIG.tier2);
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
        console.log("[Leaderboard Tier2] Victory detected! userId:", userId, "dailyStartTime:", dailyStartTime);
        setGameStatus('won');
        
        triggerVictoryConfetti();
        
        posthog?.capture("game_completed", {
          mode: "tier2",
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
          mode: "tier2",
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

  const handleShareImage = async () => {
    if (dailyNode) {
      const success = await copyShareImageToClipboard(attemptNodes, dailyNode, colorblindMode);
      if (success) {
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      } else {
        alert("Tu navegador no soporta copiar imágenes al portapapeles directamente. ¡Usa el teléfono o un navegador moderno!");
      }
    }
  };

  const handleShareText = async () => {
    if (dailyNode) {
      const text = generateEmojiGridText(attemptNodes, dailyNode, t('daily'), getUTCDayIndex(), colorblindMode);
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
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
            <Boxes className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Nodle
            </h1>
          </div>
          <p className="text-sky-400 text-sm sm:text-base font-medium">Reto Diario Tier 2</p>
        </div>

        {/* Navigation to Leaderboard */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-500/60 text-sky-400 rounded-full text-sm font-medium transition-all"
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
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${hardMode ? 'bg-sky-500' : 'bg-zinc-700'}`}
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
              nodes={tier2Nodes} 
              target={dailyNode} 
              onAttempt={addAttempt}
              attempts={attempts}
              hardMode={false}
            />
          </div>
        )}

        {isReady && dailyNode && (
          <GameBoard attempts={attemptNodes} target={dailyNode} colorblindMode={colorblindMode} />
        )}

        {isReady && attempts.length > 0 && gameStatus !== 'playing' && (
          <div className="w-full max-w-md mx-auto mt-8 flex flex-col items-center gap-4 animate-fade-in">
            <GameStatsPanel 
              currentStreak={currentStreak} 
              maxStreak={maxStreak} 
              winDistribution={winDistribution} 
              attemptsCount={attempts.length} 
              gameStatus={gameStatus} 
            />
            
            <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
              <button
                onClick={handleShareImage}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors text-sm shadow-sm"
              >
                {copiedImage ? <Check className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                {copiedImage ? t('copied') : t('share_image')}
              </button>
              <button
                onClick={handleShareText}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors text-sm shadow-sm"
              >
                {copiedText ? <Check className="w-4 h-4" /> : <AlignLeft className="w-4 h-4" />}
                {copiedText ? t('copied') : t('share_text')}
              </button>
            </div>
            
            {gameStatus === 'won' && (
              <div className="animate-fade-in flex flex-col items-center gap-2 mt-4">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{t('support_prompt')}</p>
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
          {tHub('footer_created')}
        </p>
        <KofiButton label={tKofi('coffee')} className="text-xs px-3 py-1.5" />
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

"use client";

import { useTranslations } from 'next-intl';

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Box, RefreshCw, Trophy } from "lucide-react";
import { getNodes } from "@/lib/nodes";
import { getRandomNode, PracticeFilter } from "@/lib/daily";
import { NodeData } from "@/types/node";
import { SearchBar } from "@/components/SearchBar";
import { GameBoard } from "@/components/GameBoard";
import { PracticeConfig } from "@/components/PracticeConfig";
import { useSettingsStore } from "@/store/useSettingsStore";
import { DebugConsole } from "@/components/DebugConsole";
import { KofiButton } from "@/components/KofiButton";
import { EthicalAd } from "@/components/EthicalAd";
import { usePostHog } from "posthog-js/react";
import { triggerVictoryConfetti } from "@/lib/confetti";

const MAX_ATTEMPTS = 6;

export default function PracticePage() {
  const t = useTranslations('Game');
  const tKofi = useTranslations('Kofi');
  const tHub = useTranslations('Hub');
  const colorblindMode = useSettingsStore((state) => state.colorblindMode);

  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [targetNode, setTargetNode] = useState<NodeData | null>(null);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [wins, setWins] = useState(0);
  const [roundCount, setRoundCount] = useState(1);
  const posthog = usePostHog();
  const [isReady, setIsReady] = useState(false);

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
        triggerVictoryConfetti();
        posthog?.capture("game_completed", {
          mode: "practice",
          status: "won",
          attempts_used: newAttempts.length,
          target_node_id: targetNode.id,
          target_node_name: targetNode.name
        });
      } else if (newAttempts.length >= MAX_ATTEMPTS) {
        setGameStatus("lost");
        posthog?.capture("game_completed", {
          mode: "practice",
          status: "lost",
          attempts_used: MAX_ATTEMPTS,
          target_node_id: targetNode?.id,
          target_node_name: targetNode?.name
        });
      }
    },
    [attempts, gameStatus, targetNode, posthog]
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
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors self-start text-sm font-medium -ml-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back_to_hub')}
          </Link>
          <div className="flex items-center gap-2 text-xs text-zinc-950 dark:text-zinc-500 pr-36 sm:pr-40">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold">{wins}</span>
            <span>{t('practice_wins')} {roundCount}</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center justify-center mb-8 mt-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Box className="w-8 h-8 text-zinc-400" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 text-zinc-900">
              <span className="text-purple-400">{tHub('practice')}</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base font-medium max-w-md">
            {t('practice_desc')}
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs text-violet-300 font-medium">{t('practice_active')}</span>
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
                attempts={attempts}
                hardMode={false}
              />
            </div>

            <GameBoard
              attempts={attemptNodes}
              target={targetNode}
              colorblindMode={colorblindMode}
            />

            {gameStatus === "playing" && attempts.length > 0 && (
              <button
                onClick={() => setGameStatus("lost")}
                className="mt-6 text-sm font-medium text-zinc-500 hover:text-rose-400 transition-colors underline underline-offset-4"
              >
                {t('give_up')}
              </button>
            )}

            {/* End of round */}
            {gameStatus !== "playing" && (
              <div className="flex flex-col items-center gap-3 mt-4 animate-fade-in">
                {gameStatus === "won" ? (
                  <p className="text-emerald-400 font-bold text-lg">
                    {t('correct_reveal')} <span className="underline">{targetNode.name}</span>
                  </p>
                ) : (
                  <p className="text-rose-400 font-bold text-lg">
                    {t('incorrect_reveal')} <span className="underline">{targetNode.name}</span> {t('incorrect_reveal_from')} {targetNode.software}
                  </p>
                )}
                <button
                  onClick={handleNextRound}
                  className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-bold transition-colors shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  {t('next_node')}
                </button>
              </div>
            )}
          </>
        ) : isReady && !targetNode ? (
          <div className="text-center text-zinc-950 dark:text-zinc-500 mt-8">
            <p>{t('no_nodes_filters')}</p>
          </div>
        ) : (
          <div className="text-center text-zinc-600 mt-8">{t('loading_nodes')}</div>
        )}

        <DebugConsole targetNode={targetNode} />
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
    </main>
  );
}

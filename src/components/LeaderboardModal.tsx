"use client";

import React, { useEffect, useState } from "react";
import { X, Trophy, Loader2 } from "lucide-react";
import { LeaderboardEntry } from "@/lib/leaderboard/interface";
import { useTranslations } from 'next-intl';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayIndex: number;
  currentUserId?: string;
}

function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const fraction = Math.floor((ms % 1000) / 100);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${fraction}`;
}

export function LeaderboardModal({ isOpen, onClose, dayIndex, currentUserId }: LeaderboardModalProps) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations('Leaderboard');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError("");

    fetch(`/api/leaderboard?dayIndex=${dayIndex}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setScores(data.scores || []);
        }
      })
      .catch((err) => {
        console.error("Leaderboard fetch error:", err);
        if (isMounted) setError("No se pudo cargar el Leaderboard");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, dayIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/20">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold text-lg">{t('title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 min-h-[300px]">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-950 dark:text-zinc-500 gap-2 mt-16">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>{t('loading_scores')}</p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center text-red-400 mt-16">
              <p>{error}</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-zinc-950 dark:text-zinc-500 mt-16 text-center px-4">
              <p>{t('empty')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-12 text-xs font-medium text-zinc-950 dark:text-zinc-500 px-4 py-2 uppercase tracking-wider">
                <div className="col-span-2 text-center">{t('rank')}</div>
                <div className="col-span-6">{t('user')}</div>
                <div className="col-span-2 text-center">{t('attempts')}</div>
                <div className="col-span-2 text-right">{t('time')}</div>
              </div>
              
              <div className="flex flex-col gap-1">
                {scores.map((score, index) => {
                  const isCurrentPlayer = currentUserId && score.userId === currentUserId;
                  const rank = index + 1;
                  
                  return (
                    <div 
                      key={`${score.userId}-${score.timeMs}`}
                      className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isCurrentPlayer 
                          ? "bg-violet-600/20 border border-violet-500/30 text-violet-100" 
                          : "bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className="col-span-2 text-center flex justify-center">
                        {rank === 1 ? (
                          <Trophy className="w-4 h-4 text-amber-400" />
                        ) : rank === 2 ? (
                          <span className="text-zinc-700 dark:text-zinc-300 font-bold">2</span>
                        ) : rank === 3 ? (
                          <span className="text-amber-700 font-bold">3</span>
                        ) : (
                          <span className="text-zinc-600">{rank}</span>
                        )}
                      </div>
                      
                      <div className="col-span-6 truncate font-mono text-xs">
                        {isCurrentPlayer ? t('you') : score.userId.split('-')[0]}
                      </div>
                      
                      <div className="col-span-2 text-center font-mono">
                        {score.attempts}
                      </div>
                      
                      <div className="col-span-2 text-right font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {formatTime(score.timeMs)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

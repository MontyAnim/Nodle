import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Flame, Gem, Crown, Sparkles, User, Pencil } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { NicknameModal } from './NicknameModal';

interface GameStatsPanelProps {
  currentStreak: number;
  maxStreak: number;
  winDistribution: Record<number, number>;
  attemptsCount: number;
  gameStatus: 'won' | 'lost' | 'playing';
}

export function GameStatsPanel({
  currentStreak,
  maxStreak,
  winDistribution,
  attemptsCount,
  gameStatus
}: GameStatsPanelProps) {
  const t = useTranslations('Game');
  const tProfile = useTranslations('Profile');
  const { nickname } = useSettingsStore();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  
  // Calculate max distribution to scale bars
  const totalWins = Object.values(winDistribution).reduce((a, b) => a + b, 0);
  const maxWins = Math.max(...Object.values(winDistribution), 1);

  // Determine streak badge
  let streakBadge = null;
  if (currentStreak >= 100) {
    streakBadge = { icon: Sparkles, text: t('streak_god'), color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' };
  } else if (currentStreak >= 30) {
    streakBadge = { icon: Crown, text: t('streak_crown'), color: 'text-amber-500', bg: 'bg-amber-500/10' };
  } else if (currentStreak >= 10) {
    streakBadge = { icon: Gem, text: t('streak_diamond'), color: 'text-cyan-500', bg: 'bg-cyan-500/10' };
  } else if (currentStreak >= 3) {
    streakBadge = { icon: Flame, text: t('streak_fire'), color: 'text-orange-500', bg: 'bg-orange-500/10' };
  }

  return (
    <div className="w-full flex flex-col gap-6 my-4 p-5 bg-white dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm animate-fade-in-up">
      {/* Header and Badge */}
      <div className="flex flex-col items-center justify-center gap-2">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-center">
          {t('stats_title')}
        </h3>
        
        {streakBadge && (
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${streakBadge.bg} ${streakBadge.color} animate-bounce-short`}>
            <streakBadge.icon className="w-4 h-4" />
            <span className="text-sm font-bold">{streakBadge.text}</span>
          </div>
        )}
      </div>

      {/* Streak Numbers */}
      <div className="flex justify-center gap-8 text-center">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{currentStreak}</span>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('current_streak')}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{maxStreak}</span>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{t('max_streak')}</span>
        </div>
      </div>

      {/* Player Identity Row */}
      <div className="flex items-center justify-center -mt-2">
        <button
          onClick={() => setIsNicknameModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition-colors group"
        >
          <User className="w-3 h-3 text-amber-500" />
          <span>{tProfile('playing_as')}</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{nickname || tProfile('anonymous')}</span>
          <Pencil className="w-2.5 h-2.5 text-zinc-400 group-hover:text-amber-500 transition-colors ml-0.5" />
        </button>
      </div>

      {/* Win Distribution Histogram */}
      <div className="flex flex-col gap-1.5 mt-2">
        {/* We assume 6 attempts max */}
        {[1, 2, 3, 4, 5, 6].map(num => {
          const count = winDistribution[num] || 0;
          const percentage = Math.max((count / maxWins) * 100, 7); // Min 7% width to fit the number inside
          const isCurrentWin = gameStatus === 'won' && attemptsCount === num;
          
          return (
            <div key={num} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-right font-medium text-zinc-600 dark:text-zinc-400">{num}</span>
              <div className="flex-1 h-6 bg-zinc-100 dark:bg-zinc-900/50 rounded overflow-hidden flex">
                <div 
                  className={`h-full flex items-center justify-end pr-2 font-bold text-xs transition-all duration-1000 ease-out
                    ${isCurrentWin ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'}
                  `}
                  style={{ width: `${percentage}%` }}
                >
                  {count > 0 ? count : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <NicknameModal isOpen={isNicknameModalOpen} onClose={() => setIsNicknameModalOpen(false)} />
    </div>
  );
}

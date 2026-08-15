import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  // Identidad
  userId: string;
  
  // Estado actual del día
  attempts: string[];
  dailyStartTime: number | null;
  gameStatus: 'playing' | 'won' | 'lost';
  lastPlayedTimestamp: number | null;
  hardMode: boolean;
  colorblindMode: boolean;
  
  // Debug
  debugDayOverride: number | null;
  
  // Estadísticas históricas
  currentStreak: number;
  maxStreak: number;
  winDistribution: Record<number, number>;
  
  // Acciones
  addAttempt: (nodeId: string) => void;
  setGameStatus: (status: 'won' | 'lost') => void;
  resetDailyGame: (currentTimestamp: number) => void;
  toggleHardMode: () => void;
  toggleColorblindMode: () => void;
  setDebugDayOverride: (day: number | null) => void;
}

export const createGameStore = (storageKey: string) => create<GameState>()(
  persist(
    (set) => ({
      userId: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      attempts: [],
      dailyStartTime: null,
      gameStatus: 'playing',
      lastPlayedTimestamp: null,
      currentStreak: 0,
      maxStreak: 0,
      winDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      hardMode: false,
      colorblindMode: false,
      debugDayOverride: null,

      addAttempt: (nodeId: string) =>
        set((state) => {
          const isFirstAttempt = state.attempts.length === 0;
          return {
            attempts: [...state.attempts, nodeId],
            dailyStartTime: isFirstAttempt ? Date.now() : state.dailyStartTime,
          };
        }),

      setGameStatus: (status: 'won' | 'lost') =>
        set((state) => {
          if (state.gameStatus !== 'playing') return state; // Evitar actualizar múltiples veces si ya terminó

          let newCurrentStreak = state.currentStreak;
          let newMaxStreak = state.maxStreak;
          const newWinDistribution = { ...state.winDistribution };

          if (status === 'won') {
            newCurrentStreak += 1;
            newMaxStreak = Math.max(newMaxStreak, newCurrentStreak);
            
            // Incrementar el contador para el número de intentos actual
            const attemptCount = Math.min(state.attempts.length, 6);
            if (attemptCount > 0) {
              newWinDistribution[attemptCount] += 1;
            }
          } else {
            // Si pierde, la racha se reinicia
            newCurrentStreak = 0;
          }

          return {
            gameStatus: status,
            currentStreak: newCurrentStreak,
            maxStreak: newMaxStreak,
            winDistribution: newWinDistribution,
          };
        }),

      resetDailyGame: (dayIndex: number) =>
        set((state) => {
          return {
            attempts: [],
            gameStatus: 'playing',
            lastPlayedTimestamp: dayIndex, // Now storing the dayIndex instead of ms
            dailyStartTime: null,
          };
        }),
      
      toggleHardMode: () =>
        set((state) => ({ hardMode: !state.hardMode })),

      toggleColorblindMode: () =>
        set((state) => ({ colorblindMode: !state.colorblindMode })),

      setDebugDayOverride: (day) =>
        set(() => ({ debugDayOverride: day })),
    }),
    {
      name: storageKey,
    }
  )
);

export const useClassicStore = createGameStore('nodle-storage');
export const useTier1Store = createGameStore('nodle-storage-tier1');
export const useTier2Store = createGameStore('nodle-storage-tier2');
export const useTier3Store = createGameStore('nodle-storage-tier3');

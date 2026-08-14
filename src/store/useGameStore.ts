import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  // Estado actual del día
  attempts: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  lastPlayedTimestamp: number | null;
  hardMode: boolean;
  
  // Estadísticas históricas
  currentStreak: number;
  maxStreak: number;
  winDistribution: Record<number, number>;
  
  // Acciones
  addAttempt: (nodeId: string) => void;
  setGameStatus: (status: 'won' | 'lost') => void;
  resetDailyGame: (currentTimestamp: number) => void;
  toggleHardMode: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      attempts: [],
      gameStatus: 'playing',
      lastPlayedTimestamp: null,
      currentStreak: 0,
      maxStreak: 0,
      winDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      hardMode: false,

      addAttempt: (nodeId: string) =>
        set((state) => ({
          attempts: [...state.attempts, nodeId],
        })),

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
          };
        }),
      
      toggleHardMode: () =>
        set((state) => ({ hardMode: !state.hardMode })),
    }),
    {
      name: 'nodle-storage', // Nombre de la clave en localStorage
    }
  )
);

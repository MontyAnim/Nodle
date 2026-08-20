export interface LeaderboardEntry {
  userId: string;
  nickname?: string;
  mode: string;
  dayIndex: number;
  timeMs: number;
  attempts: number;
}

export interface LeaderboardClient {
  submitScore: (entry: LeaderboardEntry) => Promise<boolean>;
  getTopScores: (mode: string, dayIndex: number, limit?: number) => Promise<LeaderboardEntry[]>;
}

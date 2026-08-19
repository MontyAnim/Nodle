export interface LeaderboardEntry {
  userId: string;
  nickname?: string;
  dayIndex: number;
  timeMs: number;
  attempts: number;
}

export interface LeaderboardClient {
  submitScore: (entry: LeaderboardEntry) => Promise<boolean>;
  getTopScores: (dayIndex: number, limit?: number) => Promise<LeaderboardEntry[]>;
}

export interface LeaderboardEntry {
  userId: string;
  dayIndex: number;
  timeMs: number;
  attempts: number;
}

export interface LeaderboardClient {
  submitScore: (entry: LeaderboardEntry) => Promise<boolean>;
}

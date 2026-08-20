import { LeaderboardClient, LeaderboardEntry } from './interface';

export class MockLeaderboardClient implements LeaderboardClient {
  async submitScore(entry: LeaderboardEntry): Promise<boolean> {
    console.log('[MockLeaderboardClient] Submitting score:', entry);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('[MockLeaderboardClient] Score submitted successfully.');
    return true;
  }

  async getTopScores(mode: string, dayIndex: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    console.log(`[MockLeaderboard] fetching top scores for mode=${mode} day=${dayIndex}`);
    return [];
  }
}

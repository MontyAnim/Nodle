import { LeaderboardClient, LeaderboardEntry } from './interface';

export class MockLeaderboardClient implements LeaderboardClient {
  async submitScore(entry: LeaderboardEntry): Promise<boolean> {
    console.log('[MockLeaderboardClient] Submitting score:', entry);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('[MockLeaderboardClient] Score submitted successfully.');
    return true;
  }
}

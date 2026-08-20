import { LeaderboardClient, LeaderboardEntry } from './interface';

const MIN_TIME_MS = 1000; // Mínimo 1 segundo para considerar un score válido

export class UpstashLeaderboardClient implements LeaderboardClient {
  private url: string;
  private token: string;

  constructor() {
    this.url = process.env.UPSTASH_REDIS_REST_URL || '';
    this.token = process.env.UPSTASH_REDIS_REST_TOKEN || '';
  }

  private isConfigured(): boolean {
    return this.url !== '' && this.token !== '';
  }

  private baseKey(mode: string, dayIndex: number): string {
    return `leaderboard:${mode}:day:${dayIndex}`;
  }

  private metaKey(mode: string, dayIndex: number, userId: string): string {
    return `leaderboard:${mode}:day:${dayIndex}:meta:${userId}`;
  }

  async submitScore(entry: LeaderboardEntry): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[UpstashLeaderboardClient] Missing environment variables. Score not submitted.');
      return false;
    }

    // Bug fix #3: reject impossibly fast scores
    if (entry.timeMs < MIN_TIME_MS) {
      console.warn(`[UpstashLeaderboardClient] Rejected score with timeMs=${entry.timeMs} (below minimum ${MIN_TIME_MS}ms)`);
      return false;
    }

    try {
      // Score formula: (attempts * 100,000,000) + timeMs
      // Lower is better — fewer attempts wins, tie-broken by time
      const score = (entry.attempts * 100_000_000) + entry.timeMs;

      // Bug fix #1: separate by mode → leaderboard:{mode}:day:{dayIndex}
      const zsetKey = this.baseKey(entry.mode, entry.dayIndex);

      // Bug fix #2: use userId as the sorted set member for automatic dedup.
      // NX flag (only add, never update) ensures we keep the FIRST (best) score of the day.
      // If a player somehow triggers this twice, we only keep their first win.
      const nxFlag = 'NX';
      const response = await fetch(
        `${this.url}/zadd/${zsetKey}/${nxFlag}/${score}/${encodeURIComponent(entry.userId)}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.ok) {
        console.error('[UpstashLeaderboardClient] Failed to submit score:', await response.text());
        return false;
      }

      // Store rich metadata in a hash keyed by userId, so the sorted set stays clean
      const meta = JSON.stringify({
        userId: entry.userId,
        nickname: entry.nickname || '',
        timeMs: entry.timeMs,
        attempts: entry.attempts,
        timestamp: Date.now(),
      });

      const metaKeyPath = this.metaKey(entry.mode, entry.dayIndex, entry.userId);
      const setResponse = await fetch(
        `${this.url}/set/${encodeURIComponent(metaKeyPath)}/${encodeURIComponent(meta)}/EX/604800`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!setResponse.ok) {
        console.warn('[UpstashLeaderboardClient] Score added but metadata failed to save');
      }

      // Set TTL on the sorted set (7 days)
      fetch(`${this.url}/expire/${zsetKey}/604800`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).catch(err => console.error('[UpstashLeaderboardClient] Failed to set TTL:', err));

      return true;
    } catch (error) {
      console.error('[UpstashLeaderboardClient] Error submitting score:', error);
      return false;
    }
  }

  async getTopScores(mode: string, dayIndex: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    if (!this.isConfigured()) return [];

    try {
      const zsetKey = this.baseKey(mode, dayIndex);

      // ZRANGE key 0 limit-1 — returns userIds sorted by score (ascending = best first)
      const response = await fetch(
        `${this.url}/zrange/${zsetKey}/0/${limit - 1}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.ok) {
        console.error('[UpstashLeaderboardClient] Failed to fetch top scores:', await response.text());
        return [];
      }

      const data = await response.json();
      const userIds: string[] = data.result || [];

      if (userIds.length === 0) return [];

      // Batch-fetch metadata for all userIds in parallel
      const metaPromises = userIds.map(async (userId): Promise<LeaderboardEntry | null> => {
        try {
          const metaKeyPath = this.metaKey(mode, dayIndex, userId);
          const metaResp = await fetch(
            `${this.url}/get/${encodeURIComponent(metaKeyPath)}`,
            { headers: { Authorization: `Bearer ${this.token}` } }
          );
          if (!metaResp.ok) return null;

          const metaData = await metaResp.json();
          if (!metaData.result) return null;

          const parsed = JSON.parse(metaData.result);
          return {
            userId: parsed.userId || userId,
            nickname: parsed.nickname || undefined,
            mode,
            dayIndex,
            timeMs: parsed.timeMs,
            attempts: parsed.attempts,
          };
        } catch {
          return null;
        }
      });

      const entries = (await Promise.all(metaPromises))
        .filter((e): e is LeaderboardEntry => e !== null);

      return entries;
    } catch (error) {
      console.error('[UpstashLeaderboardClient] Error fetching top scores:', error);
      return [];
    }
  }
}

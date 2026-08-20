import { LeaderboardClient, LeaderboardEntry } from './interface';

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

    try {
      const safeTimeMs = Math.max(1, Math.round(entry.timeMs));
      const safeAttempts = Math.min(6, Math.max(1, entry.attempts));

      // Score formula: (attempts * 100,000,000) + timeMs
      // Lower score is better — fewer attempts wins, tie-broken by time
      const score = (safeAttempts * 100_000_000) + safeTimeMs;

      // Key separated by mode: leaderboard:{mode}:day:{dayIndex}
      const zsetKey = this.baseKey(entry.mode, entry.dayIndex);

      // NX flag (only add if not existing) ensures we keep the FIRST score of the day for this user
      const nxFlag = 'NX';
      const response = await fetch(
        `${this.url}/zadd/${encodeURIComponent(zsetKey)}/${nxFlag}/${score}/${encodeURIComponent(entry.userId)}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.ok) {
        console.error('[UpstashLeaderboardClient] Failed to submit score to zset:', await response.text());
        return false;
      }

      // Store metadata (nickname, timestamp) keyed by userId
      const meta = JSON.stringify({
        userId: entry.userId,
        nickname: entry.nickname || '',
        timeMs: safeTimeMs,
        attempts: safeAttempts,
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
      fetch(`${this.url}/expire/${encodeURIComponent(zsetKey)}/604800`, {
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

      // ZRANGE key 0 limit-1 WITHSCORES — returns [userId, score, userId, score, ...]
      const response = await fetch(
        `${this.url}/zrange/${encodeURIComponent(zsetKey)}/0/${limit - 1}/WITHSCORES`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      if (!response.ok) {
        console.error('[UpstashLeaderboardClient] Failed to fetch top scores:', await response.text());
        return [];
      }

      const data = await response.json();
      const rawList: string[] = data.result || [];

      if (rawList.length === 0) return [];

      const items: { userId: string; score: number }[] = [];
      for (let i = 0; i < rawList.length; i += 2) {
        const userId = rawList[i];
        const score = parseInt(rawList[i + 1], 10);
        if (userId && !isNaN(score)) {
          items.push({ userId, score });
        }
      }

      // Fetch metadata in parallel for nicknames
      const entries = await Promise.all(
        items.map(async (item): Promise<LeaderboardEntry> => {
          const attempts = Math.floor(item.score / 100_000_000);
          const timeMs = item.score % 100_000_000;
          let nickname: string | undefined = undefined;

          try {
            const metaKeyPath = this.metaKey(mode, dayIndex, item.userId);
            const metaResp = await fetch(
              `${this.url}/get/${encodeURIComponent(metaKeyPath)}`,
              { headers: { Authorization: `Bearer ${this.token}` } }
            );

            if (metaResp.ok) {
              const metaData = await metaResp.json();
              if (metaData.result) {
                const parsed = JSON.parse(metaData.result);
                nickname = parsed.nickname || undefined;
              }
            }
          } catch {
            // Silently fallback without nickname
          }

          return {
            userId: item.userId,
            nickname,
            mode,
            dayIndex,
            timeMs,
            attempts,
          };
        })
      );

      return entries;
    } catch (error) {
      console.error('[UpstashLeaderboardClient] Error fetching top scores:', error);
      return [];
    }
  }
}

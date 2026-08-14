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

  async submitScore(entry: LeaderboardEntry): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[UpstashLeaderboardClient] Missing environment variables. Score not submitted.');
      return false;
    }

    try {
      // Score = (attempts * 100,000,000) + timeMs
      const score = (entry.attempts * 100000000) + entry.timeMs;
      
      const payload = JSON.stringify({
        userId: entry.userId,
        timeMs: entry.timeMs,
        attempts: entry.attempts,
        timestamp: Date.now()
      });

      // We'll use ZADD to a key like "leaderboard:day:123"
      const key = `leaderboard:day:${entry.dayIndex}`;

      const response = await fetch(`${this.url}/zadd/${key}/${score}/${encodeURIComponent(payload)}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        console.error('[UpstashLeaderboardClient] Failed to submit score:', await response.text());
        return false;
      }

      // Configurar expiración de 7 días (604800 segundos) para liberar espacio en el plan gratuito
      fetch(`${this.url}/expire/${key}/604800`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).catch(err => console.error('[UpstashLeaderboardClient] Failed to set TTL:', err));

      return true;
    } catch (error) {
      console.error('[UpstashLeaderboardClient] Error submitting score:', error);
      return false;
    }
  }
}

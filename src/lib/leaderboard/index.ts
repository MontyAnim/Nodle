import { LeaderboardClient } from './interface';
import { MockLeaderboardClient } from './mock';
import { UpstashLeaderboardClient } from './upstash';

// Determinar si tenemos configuradas las llaves de Upstash
const isUpstashConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Exportamos el cliente configurado
export const leaderboardClient: LeaderboardClient = isUpstashConfigured 
  ? new UpstashLeaderboardClient() 
  : new MockLeaderboardClient();

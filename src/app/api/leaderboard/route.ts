import { NextResponse } from 'next/server';
import { leaderboardClient } from '@/lib/leaderboard';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.userId || typeof body.dayIndex !== 'number' || typeof body.timeMs !== 'number' || typeof body.attempts !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (body.attempts < 1 || body.attempts > 6) {
      return NextResponse.json({ error: 'Invalid attempts count' }, { status: 400 });
    }

    const success = await leaderboardClient.submitScore({
      userId: body.userId,
      dayIndex: body.dayIndex,
      timeMs: body.timeMs,
      attempts: body.attempts,
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
    }
  } catch (error) {
    console.error('API /leaderboard error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const [totalSessions, totalCardsViewed, totalFinished, activeDaysResult, topGameResult] = await Promise.all([
      prisma.event.count({ where: { type: 'game_started' } }),
      prisma.event.count({ where: { type: 'card_viewed' } }),
      prisma.event.count({ where: { type: 'game_finished' } }),
      prisma.$queryRaw<{ days: number }[]>`
        SELECT COUNT(DISTINCT DATE("createdAt"))::int as days
        FROM events WHERE type = 'game_started'
      `,
      prisma.$queryRaw<{ gameId: string; sessions: number }[]>`
        SELECT "gameId", COUNT(*)::int as sessions
        FROM events WHERE type = 'game_started' AND "gameId" IS NOT NULL
        GROUP BY "gameId" ORDER BY sessions DESC LIMIT 1
      `,
    ]);

    let topGame = null;
    if (topGameResult[0]?.gameId) {
      const game = await prisma.game.findUnique({
        where: { id: topGameResult[0].gameId },
        select: { name: true, icon: true },
      });
      if (game) topGame = { ...game, sessions: topGameResult[0].sessions };
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSessions,
        totalCardsViewed,
        totalFinished,
        activeDays: activeDaysResult[0]?.days ?? 0,
        topGame,
      },
    });
  } catch (err) {
    return apiError(err);
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const rows = await prisma.$queryRaw<{ gameId: string; sessions: number }[]>`
      SELECT "gameId", COUNT(*)::int as sessions
      FROM events
      WHERE type = 'game_started' AND "gameId" IS NOT NULL
      GROUP BY "gameId"
      ORDER BY sessions DESC
      LIMIT 10
    `;

    const gameIds = rows.map((r) => r.gameId);
    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true, icon: true, colorMain: true },
    });

    const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));
    const data = rows.map((r) => ({
      ...r,
      name: gameMap[r.gameId]?.name ?? r.gameId,
      icon: gameMap[r.gameId]?.icon ?? '🎮',
      colorMain: gameMap[r.gameId]?.colorMain ?? '#6366f1',
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return apiError(err);
  }
}

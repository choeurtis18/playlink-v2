export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAppAuth } from '@/lib/api-utils/app-auth';
import { getPlayerType } from '@/lib/tag-mapping';

export async function GET(request: NextRequest) {
  try {
    await requireAppAuth(request);
    const players = await prisma.player.findMany({
      include: {
        sessions: { select: { score: true } },
        appUser: { select: { email: true } },
      },
    });

    const ranked = players
      .map((p) => {
        const totalScore = p.sessions.reduce((sum, s) => sum + s.score, 0);
        const tagScores = (p.tagScores ?? {}) as Record<string, number>;
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          totalScore,
          totalGames: p.sessions.length,
          playerType: getPlayerType(tagScores),
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 50);

    return NextResponse.json({ data: ranked });
  } catch (e) {
    return apiError(e);
  }
}

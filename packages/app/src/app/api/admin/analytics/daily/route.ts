export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(parseInt(searchParams.get('days') ?? '30'), 1), 90);

    const rows = await prisma.$queryRaw<{ date: string; sessions: number; cardsViewed: number }[]>`
      SELECT
        TO_CHAR(DATE("createdAt" AT TIME ZONE 'Europe/Paris'), 'YYYY-MM-DD') as date,
        COUNT(*) FILTER (WHERE type = 'game_started')::int as sessions,
        COUNT(*) FILTER (WHERE type = 'card_viewed')::int as "cardsViewed"
      FROM events
      WHERE "createdAt" >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY DATE("createdAt" AT TIME ZONE 'Europe/Paris')
      ORDER BY date ASC
    `;

    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    return apiError(err);
  }
}

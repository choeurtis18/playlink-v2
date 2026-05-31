export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const rows = await prisma.$queryRaw<{ hour: number; sessions: number }[]>`
      SELECT
        EXTRACT(HOUR FROM "createdAt" AT TIME ZONE 'Europe/Paris')::int as hour,
        COUNT(*)::int as sessions
      FROM events
      WHERE type = 'game_started'
      GROUP BY EXTRACT(HOUR FROM "createdAt" AT TIME ZONE 'Europe/Paris')
      ORDER BY hour ASC
    `;

    // Fill missing hours with 0
    const hourMap = Object.fromEntries(rows.map((r) => [r.hour, r.sessions]));
    const data = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${String(h).padStart(2, '0')}h`,
      sessions: hourMap[h] ?? 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return apiError(err);
  }
}

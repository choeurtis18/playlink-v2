export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const rows = await prisma.$queryRaw<{ categoryId: string; sessions: number }[]>`
      SELECT "categoryId", COUNT(*)::int as sessions
      FROM events
      WHERE type = 'game_started' AND "categoryId" IS NOT NULL
      GROUP BY "categoryId"
      ORDER BY sessions DESC
      LIMIT 10
    `;

    const categoryIds = rows.map((r) => r.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true, game: { select: { name: true, colorMain: true } } },
    });

    const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
    const data = rows.map((r) => ({
      ...r,
      name: catMap[r.categoryId]?.name ?? r.categoryId,
      icon: catMap[r.categoryId]?.icon ?? '🃏',
      gameName: catMap[r.categoryId]?.game?.name ?? '',
      colorMain: catMap[r.categoryId]?.game?.colorMain ?? '#6366f1',
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return apiError(err);
  }
}

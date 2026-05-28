export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const events = await prisma.event.findMany({
      where: {
        ...(from ? { createdAt: { gte: new Date(from) } } : {}),
        ...(to ? { createdAt: { lte: new Date(to) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    const gameIds = [...new Set(events.map((e) => e.gameId).filter(Boolean) as string[])];
    const categoryIds = [...new Set(events.map((e) => e.categoryId).filter(Boolean) as string[])];

    const [games, categories] = await Promise.all([
      prisma.game.findMany({ where: { id: { in: gameIds } }, select: { id: true, name: true } }),
      prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true, name: true } }),
    ]);

    const gameMap = Object.fromEntries(games.map((g) => [g.id, g.name]));
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    const header = 'id,type,game,category,metadata,createdAt';
    const rows = events.map((e) => [
      e.id,
      e.type,
      e.gameId ? (gameMap[e.gameId] ?? e.gameId) : '',
      e.categoryId ? (catMap[e.categoryId] ?? e.categoryId) : '',
      e.metadata ? JSON.stringify(e.metadata).replace(/"/g, '""') : '',
      e.createdAt.toISOString(),
    ].map((v) => `"${v}"`).join(','));

    const csv = [header, ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="analytics-export-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    return apiError(err);
  }
}

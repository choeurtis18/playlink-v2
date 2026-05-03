export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';
import { CreateGameSchema } from '@playlink/shared';

function parsePage(searchParams: URLSearchParams, defaultLimit = 20) {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? String(defaultLimit)) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const { page, limit, skip } = parsePage(request.nextUrl.searchParams);
    const [games, total] = await Promise.all([
      prisma.game.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { categories: true } } },
        skip,
        take: limit,
      }),
      prisma.game.count(),
    ]);
    return NextResponse.json({ success: true, data: games, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = CreateGameSchema.parse(await request.json());
    const game = await prisma.game.create({ data: body });
    return NextResponse.json({ success: true, data: game }, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}

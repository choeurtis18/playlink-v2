export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';
import { CreateCardSchema } from '@playlink/shared';

function parsePage(searchParams: URLSearchParams, defaultLimit = 25) {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? String(defaultLimit)) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const { page, limit, skip } = parsePage(request.nextUrl.searchParams);
    const { searchParams } = request.nextUrl;
    const gameId = searchParams.get('gameId');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    else if (gameId) where.category = { gameId };
    if (search) where.text = { contains: search, mode: 'insensitive' };

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy: { order: 'asc' },
        include: { category: { select: { name: true, game: { select: { id: true, name: true } } } } },
        skip,
        take: limit,
      }),
      prisma.card.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: cards, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = CreateCardSchema.parse(await request.json());
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) throw createError('Catégorie introuvable', 404);
    const card = await prisma.card.create({ data: body });
    return NextResponse.json({ success: true, data: card }, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}

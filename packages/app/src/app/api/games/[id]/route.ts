import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';

const gameInclude = {
  categories: {
    orderBy: { order: 'asc' as const },
    include: {
      cards: {
        where: { active: true },
        orderBy: { order: 'asc' as const },
        select: { id: true, text: true, difficulty: true, tags: true, order: true },
      },
    },
  },
};

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const game = await prisma.game.findUnique({
      where: { slug: params.id },
      include: gameInclude,
    });
    if (!game) throw createError('Jeu introuvable', 404);
    return NextResponse.json({ success: true, data: game });
  } catch (err) {
    return apiError(err);
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';

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

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: gameInclude,
    });
    return NextResponse.json({ success: true, data: games });
  } catch (err) {
    return apiError(err);
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        colorMain: true,
        colorSecondary: true,
        order: true,
        categories: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
            order: true,
            cards: {
              where: { active: true },
              orderBy: { order: 'asc' },
              select: { id: true, text: true, difficulty: true, tags: true, order: true },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: games, exportedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    );
  } catch (err) {
    return apiError(err);
  }
}

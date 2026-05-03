export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const [games, categories, cards] = await Promise.all([
      prisma.game.count(),
      prisma.category.count(),
      prisma.card.count(),
    ]);
    return NextResponse.json({ success: true, data: { games, categories, cards } });
  } catch (err) {
    return apiError(err);
  }
}

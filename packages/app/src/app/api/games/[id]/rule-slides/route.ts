export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const slides = await prisma.gameRuleSlide.findMany({
      where: { game: { slug: params.id } },
      orderBy: { order: 'asc' },
      select: { id: true, order: true, imageUrl: true, title: true, content: true },
    });
    return NextResponse.json(
      { data: slides },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch (e) {
    return apiError(e);
  }
}

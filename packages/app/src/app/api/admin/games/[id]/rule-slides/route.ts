export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { requireAuth } from '@/lib/api-utils/auth';
import { apiError } from '@/lib/api-utils/error-handler';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const slides = await prisma.gameRuleSlide.findMany({
      where: { gameId: params.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ data: slides });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const body = await request.json() as { title: string; content: string; imageUrl?: string; order?: number };
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
    }
    const count = await prisma.gameRuleSlide.count({ where: { gameId: params.id } });
    const slide = await prisma.gameRuleSlide.create({
      data: {
        gameId: params.id,
        title: body.title.trim(),
        content: body.content.trim(),
        imageUrl: body.imageUrl ?? null,
        order: body.order ?? count,
      },
    });
    return NextResponse.json({ data: slide }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}

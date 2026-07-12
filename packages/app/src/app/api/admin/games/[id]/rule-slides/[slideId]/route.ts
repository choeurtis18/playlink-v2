export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { requireAuth } from '@/lib/api-utils/auth';
import { apiError } from '@/lib/api-utils/error-handler';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; slideId: string } },
) {
  try {
    await requireAuth(request);
    const body = await request.json() as { title?: string; content?: string; imageUrl?: string | null; order?: number };
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title.trim();
    if (body.content !== undefined) data.content = body.content.trim();
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.order !== undefined) data.order = body.order;
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }
    const slide = await prisma.gameRuleSlide.update({
      where: { id: params.slideId, gameId: params.id },
      data,
    });
    return NextResponse.json({ data: slide });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; slideId: string } },
) {
  try {
    await requireAuth(request);
    await prisma.gameRuleSlide.delete({ where: { id: params.slideId, gameId: params.id } });
    return NextResponse.json({ data: { ok: true } });
  } catch (e) {
    return apiError(e);
  }
}

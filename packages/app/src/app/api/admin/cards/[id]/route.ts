import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';
import { UpdateCardSchema } from '@playlink/shared';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const card = await prisma.card.findUnique({
      where: { id: params.id },
      include: { category: { select: { name: true, game: { select: { id: true, name: true } } } } },
    });
    if (!card) throw createError('Carte introuvable', 404);
    return NextResponse.json({ success: true, data: card });
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const body = UpdateCardSchema.parse(await request.json());
    const card = await prisma.card.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: card });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return apiError(createError('Carte introuvable', 404));
    return apiError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    await prisma.card.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return apiError(createError('Carte introuvable', 404));
    return apiError(err);
  }
}

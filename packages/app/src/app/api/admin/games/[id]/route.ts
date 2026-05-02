import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';
import { UpdateGameSchema } from '@playlink/shared';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const game = await prisma.game.findUnique({ where: { id: params.id } });
    if (!game) throw createError('Jeu introuvable', 404);
    return NextResponse.json({ success: true, data: game });
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const body = UpdateGameSchema.parse(await request.json());
    const game = await prisma.game.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: game });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return apiError(createError('Jeu introuvable', 404));
    return apiError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    await prisma.game.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return apiError(createError('Jeu introuvable', 404));
    return apiError(err);
  }
}

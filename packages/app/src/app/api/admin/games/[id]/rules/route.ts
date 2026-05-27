export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';
import { RulesSchema } from '@playlink/shared';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const rules = await prisma.gameRules.findUnique({ where: { gameId: params.id } });
    return NextResponse.json({ success: true, data: { rules: rules?.rules ?? '' } });
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const body = RulesSchema.parse(await request.json());

    const game = await prisma.game.findUnique({ where: { id: params.id }, select: { id: true } });
    if (!game) throw createError('Jeu introuvable', 404);

    const result = await prisma.gameRules.upsert({
      where: { gameId: params.id },
      create: { gameId: params.id, rules: body.rules },
      update: { rules: body.rules },
    });

    return NextResponse.json({ success: true, data: { rules: result.rules } });
  } catch (err) {
    console.error('[PUT rules] raw error:', err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return apiError(createError('Jeu introuvable', 404));
    }
    return apiError(err);
  }
}

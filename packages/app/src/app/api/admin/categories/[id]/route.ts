import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';
import { UpdateCategorySchema } from '@playlink/shared';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const category = await prisma.category.findUnique({ where: { id: params.id } });
    if (!category) throw createError('Catégorie introuvable', 404);
    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const body = UpdateCategorySchema.parse(await request.json());
    const category = await prisma.category.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return apiError(createError('Catégorie introuvable', 404));
    return apiError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return apiError(createError('Catégorie introuvable', 404));
    return apiError(err);
  }
}

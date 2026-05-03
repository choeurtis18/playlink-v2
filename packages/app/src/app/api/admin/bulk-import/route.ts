export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

const BulkImportSchema = z.object({
  categoryId: z.string().min(1),
  cards: z.array(z.object({
    text: z.string().min(1).max(500),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    tags: z.array(z.string()).optional(),
  })).min(1),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const { categoryId, cards } = BulkImportSchema.parse(await request.json());
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw createError('Catégorie introuvable', 404);

    const maxOrderResult = await prisma.card.aggregate({
      where: { categoryId },
      _max: { order: true },
    });
    const startOrder = (maxOrderResult._max.order ?? -1) + 1;

    const created = await prisma.card.createMany({
      data: cards.map((c, i) => ({
        categoryId,
        text: c.text,
        difficulty: c.difficulty,
        tags: c.tags ?? [],
        order: startOrder + i,
      })),
    });

    return NextResponse.json({ success: true, data: { count: created.count } }, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}

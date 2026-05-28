export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { EventSchema } from '@playlink/shared';

export async function POST(request: NextRequest) {
  try {
    const body = EventSchema.parse(await request.json());
    await prisma.event.create({
      data: {
        type: body.type,
        gameId: body.gameId ?? null,
        categoryId: body.categoryId ?? null,
        metadata: body.metadata ? (body.metadata as object) : undefined,
      },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}

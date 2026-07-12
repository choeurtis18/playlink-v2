export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { requireAuth } from '@/lib/api-utils/auth';
import { apiError } from '@/lib/api-utils/error-handler';

export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
  try {
    await requireAuth(_req);
    const doc = await prisma.legalContent.findUnique({ where: { key: params.key } });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: doc });
  } catch (e) {
    return apiError(e);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  try {
    await requireAuth(req);
    const { content } = await req.json() as { content: string };
    if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 });
    const doc = await prisma.legalContent.update({
      where: { key: params.key },
      data: { content },
    });
    return NextResponse.json({ data: doc });
  } catch (e) {
    return apiError(e);
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';

export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const doc = await prisma.legalContent.findUnique({ where: { key: params.key } });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: doc });
  } catch (e) {
    return apiError(e);
  }
}

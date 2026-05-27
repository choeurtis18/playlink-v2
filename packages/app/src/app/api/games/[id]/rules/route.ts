export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const game = await prisma.game.findUnique({
      where: { slug: params.id },
      select: { id: true, rules: { select: { rules: true, updatedAt: true } } },
    });
    if (!game) {
      return NextResponse.json({ success: true, data: { rules: null } });
    }
    return NextResponse.json(
      { success: true, data: { rules: game.rules?.rules ?? null } },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch (err) {
    return apiError(err);
  }
}

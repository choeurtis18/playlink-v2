export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAppAuth } from '@/lib/api-utils/app-auth';

export async function GET(request: NextRequest) {
  try {
    const appUser = await requireAppAuth(request);

    const userBadges = await prisma.userBadge.findMany({
      where: { appUserId: appUser.id },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    return NextResponse.json({ data: userBadges });
  } catch (e) {
    return apiError(e);
  }
}

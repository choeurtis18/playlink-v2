export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAppAuth } from '@/lib/api-utils/app-auth';

export async function GET(request: NextRequest) {
  try {
    const appUser = await requireAppAuth(request);

    const players = await prisma.player.findMany({
      where: { appUserId: appUser.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: players });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const appUser = await requireAppAuth(request);
    const body = await request.json();

    const { name, avatar } = body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const player = await prisma.player.create({
      data: {
        name: name.trim(),
        avatar: avatar ?? null,
        appUserId: appUser.id,
      },
    });

    return NextResponse.json({ data: player }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}

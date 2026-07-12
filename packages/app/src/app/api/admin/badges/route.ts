export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { requireAuth } from '@/lib/api-utils/auth';
import { apiError } from '@/lib/api-utils/error-handler';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const badges = await prisma.badge.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ data: badges });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json() as { key: string; name: string; description: string; icon: string };
    const { key, name, description, icon } = body;
    if (!key?.trim() || !name?.trim() || !description?.trim() || !icon?.trim()) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    const badge = await prisma.badge.create({ data: { key: key.trim(), name: name.trim(), description: description.trim(), icon: icon.trim() } });
    return NextResponse.json({ data: badge }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}

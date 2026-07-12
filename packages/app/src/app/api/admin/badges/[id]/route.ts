export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { requireAuth } from '@/lib/api-utils/auth';
import { apiError } from '@/lib/api-utils/error-handler';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const body = await request.json() as { name?: string; description?: string; icon?: string };
    const data: Record<string, string> = {};
    if (body.name?.trim()) data.name = body.name.trim();
    if (body.description?.trim()) data.description = body.description.trim();
    if (body.icon?.trim()) data.icon = body.icon.trim();
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    const badge = await prisma.badge.update({ where: { id: params.id }, data });
    return NextResponse.json({ data: badge });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    await prisma.userBadge.deleteMany({ where: { badgeId: params.id } });
    await prisma.badge.delete({ where: { id: params.id } });
    return NextResponse.json({ data: { ok: true } });
  } catch (e) {
    return apiError(e);
  }
}

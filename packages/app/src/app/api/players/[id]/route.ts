export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAppAuth } from '@/lib/api-utils/app-auth';
import { getPlayerType } from '@/lib/tag-mapping';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appUser = await requireAppAuth(request);

    const player = await prisma.player.findFirst({
      where: { id: params.id, appUserId: appUser.id },
      include: {
        sessions: {
          include: { session: true },
          orderBy: { session: { createdAt: 'desc' } },
          take: 10,
        },
      },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const tagScores = (player.tagScores ?? {}) as Record<string, number>;
    const totalScore = player.sessions.reduce((sum, s) => sum + s.score, 0);
    const totalGames = player.sessions.length;

    return NextResponse.json({
      data: {
        ...player,
        playerType: getPlayerType(tagScores),
        totalScore,
        totalGames,
      },
    });
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appUser = await requireAppAuth(request);
    const { name } = await request.json() as { name: string };
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const existing = await prisma.player.findFirst({ where: { id: params.id, appUserId: appUser.id } });
    if (!existing) return NextResponse.json({ error: 'Player not found' }, { status: 404 });

    const duplicate = await prisma.player.findFirst({
      where: { appUserId: appUser.id, name: { equals: name.trim(), mode: 'insensitive' }, id: { not: params.id } },
    });
    if (duplicate) return NextResponse.json({ error: 'Ce nom est déjà utilisé' }, { status: 409 });

    const updated = await prisma.player.update({ where: { id: params.id }, data: { name: name.trim() } });
    return NextResponse.json({ data: updated });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appUser = await requireAppAuth(request);
    const existing = await prisma.player.findFirst({ where: { id: params.id, appUserId: appUser.id } });
    if (!existing) return NextResponse.json({ error: 'Player not found' }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      // Récupérer les sessions où ce joueur était le seul participant
      const sessionIds = (await tx.gameSessionPlayer.findMany({
        where: { playerId: params.id },
        select: { sessionId: true },
      })).map((r) => r.sessionId);

      // Supprimer les entrées GameSessionPlayer du joueur
      await tx.gameSessionPlayer.deleteMany({ where: { playerId: params.id } });

      // Supprimer les GameSession qui n'ont plus aucun participant
      if (sessionIds.length > 0) {
        const orphaned = await tx.gameSession.findMany({
          where: { id: { in: sessionIds }, players: { none: {} } },
          select: { id: true },
        });
        if (orphaned.length > 0) {
          await tx.gameSession.deleteMany({ where: { id: { in: orphaned.map((s) => s.id) } } });
        }
      }

      await tx.player.delete({ where: { id: params.id } });
    });

    return NextResponse.json({ data: { ok: true } });
  } catch (e) {
    return apiError(e);
  }
}

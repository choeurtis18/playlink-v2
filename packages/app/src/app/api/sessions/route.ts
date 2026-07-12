export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAppAuth } from '@/lib/api-utils/app-auth';

const BADGES = [
  { key: 'first_win', name: 'Première victoire', description: 'Remporter sa première partie', icon: '🏆' },
  { key: 'party_legend', name: 'Légende de soirée', description: '20 victoires au total', icon: '👑' },
  { key: 'social_butterfly', name: 'Papillon social', description: '5 parties avec 4 joueurs ou plus', icon: '🦋' },
  { key: 'truth_seeker', name: 'Chercheur de vérité', description: '10 cartes "vérité" gagnées', icon: '🔍' },
  { key: 'three_peat', name: 'Triplé', description: '3 victoires consécutives dans une même session', icon: '🔥' },
];

async function checkAndAwardBadges(
  appUserId: string,
  sessionResult: {
    playerScores: { playerId: string; score: number; tagScoresGained: Record<string, number> }[];
    playerCount: number;
  },
) {
  const earnedBadgeKeys: string[] = [];

  const existingBadges = await prisma.userBadge.findMany({
    where: { appUserId },
    include: { badge: true },
  });
  const ownedKeys = new Set(existingBadges.map((ub) => ub.badge.key));

  const allSessions = await prisma.gameSessionPlayer.findMany({
    where: { player: { appUserId } },
    include: { session: true },
    orderBy: { session: { createdAt: 'asc' } },
  });

  const totalScore = allSessions.reduce((sum, s) => sum + s.score, 0);
  const totalTruthCards = allSessions.reduce((sum, s) => {
    const tags = (s.tagScoresGained ?? {}) as Record<string, number>;
    return sum + (tags['vérité'] ?? 0);
  }, 0);

  if (!ownedKeys.has('first_win') && totalScore >= 1) {
    earnedBadgeKeys.push('first_win');
  }

  if (!ownedKeys.has('party_legend') && totalScore >= 20) {
    earnedBadgeKeys.push('party_legend');
  }

  if (!ownedKeys.has('truth_seeker') && totalTruthCards >= 10) {
    earnedBadgeKeys.push('truth_seeker');
  }

  if (!ownedKeys.has('social_butterfly') && sessionResult.playerCount >= 4) {
    const bigSessions = await prisma.gameSession.findMany({
      where: {
        players: { some: { player: { appUserId } } },
      },
      include: { _count: { select: { players: true } } },
    });
    const count = bigSessions.filter((s) => s._count.players >= 4).length;
    if (count >= 5) earnedBadgeKeys.push('social_butterfly');
  }

  if (earnedBadgeKeys.length === 0) return [];

  const badges = await prisma.badge.findMany({
    where: { key: { in: earnedBadgeKeys } },
  });

  await prisma.userBadge.createMany({
    data: badges.map((b) => ({ appUserId, badgeId: b.id })),
    skipDuplicates: true,
  });

  return badges;
}

interface SessionPlayerInput {
  playerId: string;
  score: number;
  tagScoresGained: Record<string, number>;
}

export async function POST(request: NextRequest) {
  try {
    const appUser = await requireAppAuth(request);

    const body = await request.json();
    const { gameId, categoryId, players } = body as {
      gameId: string;
      categoryId: string;
      players: SessionPlayerInput[];
    };

    if (!gameId || !categoryId || !Array.isArray(players) || players.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const playerIds = players.map((p) => p.playerId);
    const existingPlayers = await prisma.player.findMany({
      where: { id: { in: playerIds }, appUserId: appUser.id },
    });

    if (existingPlayers.length !== playerIds.length) {
      return NextResponse.json({ error: 'One or more players not found' }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const session = await tx.gameSession.create({
        data: {
          gameId,
          categoryId,
          players: {
            create: players.map((p) => ({
              playerId: p.playerId,
              score: p.score,
              tagScoresGained: p.tagScoresGained,
            })),
          },
        },
      });

      for (const p of players) {
        const existing = await tx.player.findUnique({ where: { id: p.playerId } });
        const currentTags = (existing?.tagScores ?? {}) as Record<string, number>;
        const merged: Record<string, number> = { ...currentTags };
        for (const [tag, val] of Object.entries(p.tagScoresGained)) {
          merged[tag] = (merged[tag] ?? 0) + val;
        }
        await tx.player.update({
          where: { id: p.playerId },
          data: { tagScores: merged },
        });
      }

      return session;
    });

    const newBadges = await checkAndAwardBadges(appUser.id, {
      playerScores: players,
      playerCount: players.length,
    });

    return NextResponse.json({ data: { session: result, newBadges } }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}

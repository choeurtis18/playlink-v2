import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';
import { createError } from '../middleware/errorHandler.js';

const gameInclude = {
  categories: {
    orderBy: { order: 'asc' as const },
    include: {
      cards: {
        where: { active: true },
        orderBy: { order: 'asc' as const },
        select: { id: true, text: true, difficulty: true, tags: true, order: true },
      },
    },
  },
};

export async function listGames(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const games = await prisma.game.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: gameInclude,
    });
    res.json({ success: true, data: games });
  } catch (err) {
    next(err);
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await prisma.game.findUnique({
      where: { slug: req.params.gameId },
      include: gameInclude,
    });
    if (!game) return next(createError('Game not found', 404));
    res.json({ success: true, data: game });
  } catch (err) {
    next(err);
  }
}

export async function exportCards(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const games = await prisma.game.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        colorMain: true,
        colorSecondary: true,
        order: true,
        categories: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            order: true,
            cards: {
              where: { active: true },
              orderBy: { order: 'asc' },
              select: { id: true, text: true, difficulty: true, tags: true, order: true },
            },
          },
        },
      },
    });

    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 min cache
    res.json({ success: true, data: games, exportedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}

import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import {
  CreateGameSchema,
  UpdateGameSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  CreateCardSchema,
  UpdateCardSchema,
} from '@playlink/shared';

const BulkImportSchema = z.object({
  categoryId: z.string().min(1),
  cards: z.array(
    z.object({
      text: z.string().min(1).max(500),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      tags: z.array(z.string()).optional(),
    }),
  ).min(1),
});

// ── Games ────────────────────────────────────────────────────────────────────

export async function adminListGames(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const games = await prisma.game.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { categories: true } } },
    });
    res.json({ success: true, data: games });
  } catch (err) { next(err); }
}

export async function adminCreateGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = CreateGameSchema.parse(req.body);
    const game = await prisma.game.create({ data: body });
    res.status(201).json({ success: true, data: game });
  } catch (err) { next(err); }
}

export async function adminUpdateGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = UpdateGameSchema.parse(req.body);
    const game = await prisma.game.update({ where: { id: req.params.id }, data: body });
    res.json({ success: true, data: game });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') return next(createError('Game not found', 404));
    next(err);
  }
}

export async function adminDeleteGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.game.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') return next(createError('Game not found', 404));
    next(err);
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function adminListCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const where = req.query.gameId ? { gameId: String(req.query.gameId) } : {};
    const categories = await prisma.category.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { _count: { select: { cards: true } } },
    });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
}

export async function adminCreateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = CreateCategorySchema.parse(req.body);
    const category = await prisma.category.create({ data: body });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
}

export async function adminUpdateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = UpdateCategorySchema.parse(req.body);
    const category = await prisma.category.update({ where: { id: req.params.id }, data: body });
    res.json({ success: true, data: category });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') return next(createError('Category not found', 404));
    next(err);
  }
}

export async function adminDeleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') return next(createError('Category not found', 404));
    next(err);
  }
}

// ── Cards ────────────────────────────────────────────────────────────────────

export async function adminListCards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { gameId, categoryId, search } = req.query;
    const where: Record<string, unknown> = {};

    if (categoryId) where.categoryId = String(categoryId);
    if (gameId) where.category = { gameId: String(gameId) };
    if (search) where.text = { contains: String(search), mode: 'insensitive' };

    const cards = await prisma.card.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { category: { select: { name: true, game: { select: { name: true } } } } },
    });
    res.json({ success: true, data: cards });
  } catch (err) { next(err); }
}

export async function adminCreateCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = CreateCardSchema.parse(req.body);
    const card = await prisma.card.create({ data: body });
    res.status(201).json({ success: true, data: card });
  } catch (err) { next(err); }
}

export async function adminUpdateCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = UpdateCardSchema.parse(req.body);
    const card = await prisma.card.update({ where: { id: req.params.id }, data: body });
    res.json({ success: true, data: card });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') return next(createError('Card not found', 404));
    next(err);
  }
}

export async function adminDeleteCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.card.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2025') return next(createError('Card not found', 404));
    next(err);
  }
}

// ── Bulk Import ───────────────────────────────────────────────────────────────

export async function adminBulkImport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { categoryId, cards } = BulkImportSchema.parse(req.body);

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return next(createError('Category not found', 404));

    // Continue order after existing cards in this category
    const maxOrderResult = await prisma.card.aggregate({
      where: { categoryId },
      _max: { order: true },
    });
    const startOrder = (maxOrderResult._max.order ?? -1) + 1;

    const created = await prisma.card.createMany({
      data: cards.map((c, i) => ({
        categoryId,
        text: c.text,
        difficulty: c.difficulty,
        tags: c.tags ?? [],
        order: startOrder + i,
      })),
    });

    res.status(201).json({ success: true, data: { count: created.count } });
  } catch (err) { next(err); }
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function adminStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [games, categories, cards] = await Promise.all([
      prisma.game.count(),
      prisma.category.count(),
      prisma.card.count(),
    ]);
    res.json({ success: true, data: { games, categories, cards } });
  } catch (err) { next(err); }
}

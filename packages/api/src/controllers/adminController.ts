import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
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

function parsePage(query: Request['query'], defaultLimit = 20): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(String(query.page ?? '1')) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? String(defaultLimit))) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

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

export async function adminListGames(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePage(req.query);
    const [games, total] = await Promise.all([
      prisma.game.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { categories: true } } },
        skip,
        take: limit,
      }),
      prisma.game.count(),
    ]);
    res.json({ success: true, data: games, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function adminGetGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await prisma.game.findUnique({ where: { id: req.params.id } });
    if (!game) return next(createError('Jeu introuvable', 404));
    res.json({ success: true, data: game });
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
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return next(createError('Jeu introuvable', 404));
    next(err);
  }
}

export async function adminDeleteGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.game.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return next(createError('Jeu introuvable', 404));
    next(err);
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function adminListCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePage(req.query);
    const where = req.query.gameId ? { gameId: String(req.query.gameId) } : {};
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { order: 'asc' },
        include: { _count: { select: { cards: true } } },
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);
    res.json({ success: true, data: categories, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function adminGetCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) return next(createError('Catégorie introuvable', 404));
    res.json({ success: true, data: category });
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
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return next(createError('Catégorie introuvable', 404));
    next(err);
  }
}

export async function adminDeleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return next(createError('Catégorie introuvable', 404));
    next(err);
  }
}

// ── Cards ────────────────────────────────────────────────────────────────────

export async function adminListCards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePage(req.query, 25);
    const { gameId, categoryId, search } = req.query;
    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = String(categoryId);
    } else if (gameId) {
      where.category = { gameId: String(gameId) };
    }
    if (search) where.text = { contains: String(search), mode: 'insensitive' };

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy: { order: 'asc' },
        include: { category: { select: { name: true, game: { select: { id: true, name: true } } } } },
        skip,
        take: limit,
      }),
      prisma.card.count({ where }),
    ]);
    res.json({ success: true, data: cards, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function adminGetCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
      include: { category: { select: { name: true, game: { select: { id: true, name: true } } } } },
    });
    if (!card) return next(createError('Carte introuvable', 404));
    res.json({ success: true, data: card });
  } catch (err) { next(err); }
}

export async function adminCreateCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = CreateCardSchema.parse(req.body);
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) return next(createError('Catégorie introuvable', 404));
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
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return next(createError('Carte introuvable', 404));
    next(err);
  }
}

export async function adminDeleteCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.card.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return next(createError('Carte introuvable', 404));
    next(err);
  }
}

// ── Bulk Import ───────────────────────────────────────────────────────────────

export async function adminBulkImport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { categoryId, cards } = BulkImportSchema.parse(req.body);

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return next(createError('Catégorie introuvable', 404));

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

// ── CSV helpers ───────────────────────────────────────────────────────────────

function escapeCSV(val: unknown): string {
  const s = val === null || val === undefined ? '' : String(val);
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowToCSV(values: unknown[]): string {
  return values.map(escapeCSV).join(',');
}

function parseCSVLine(line: string, sep: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (line.startsWith(sep, i)) { result.push(current); current = ''; i += sep.length - 1; }
      else { current += ch; }
    }
  }
  result.push(current);
  return result;
}

function detectSeparator(firstLine: string): string {
  const semicolons = (firstLine.match(/;/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  return semicolons > commas ? ';' : ',';
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const sep = detectSeparator(lines[0]);
  const headers = parseCSVLine(lines[0], sep);
  const rows = lines.slice(1).map((l) => parseCSVLine(l, sep));
  return { headers, rows };
}

function sendCSV(res: Response, filename: string, headers: string[], rows: unknown[][]): void {
  const lines = [headers.join(','), ...rows.map(rowToCSV)].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send('﻿' + lines); // BOM for Excel UTF-8 compatibility
}

// ── Export ────────────────────────────────────────────────────────────────────

export async function adminExportGames(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const games = await prisma.game.findMany({ orderBy: { order: 'asc' } });
    const headers = ['id', 'name', 'slug', 'description', 'icon', 'colorMain', 'colorSecondary', 'active', 'order'];
    const rows = games.map((g) => [g.id, g.name, g.slug, g.description, g.icon, g.colorMain, g.colorSecondary, g.active, g.order]);
    sendCSV(res, 'games.csv', headers, rows);
  } catch (err) { next(err); }
}

export async function adminExportCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const where = req.query.gameId ? { gameId: String(req.query.gameId) } : {};
    const categories = await prisma.category.findMany({ where, orderBy: { order: 'asc' } });
    const headers = ['id', 'gameId', 'name', 'slug', 'description', 'order'];
    const rows = categories.map((c) => [c.id, c.gameId, c.name, c.slug, c.description, c.order]);
    sendCSV(res, 'categories.csv', headers, rows);
  } catch (err) { next(err); }
}

export async function adminExportCards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { gameId, categoryId, search } = req.query;
    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = String(categoryId);
    if (gameId) where.category = { gameId: String(gameId) };
    if (search) where.text = { contains: String(search), mode: 'insensitive' };
    const cards = await prisma.card.findMany({ where, orderBy: { order: 'asc' } });
    const headers = ['id', 'categoryId', 'text', 'difficulty', 'tags', 'active', 'order'];
    const rows = cards.map((c) => [c.id, c.categoryId, c.text, c.difficulty, c.tags.join('|'), c.active, c.order]);
    sendCSV(res, 'cards.csv', headers, rows);
  } catch (err) { next(err); }
}

// ── CSV Import ────────────────────────────────────────────────────────────────

const CsvImportSchema = z.object({ csv: z.string().min(1) });

export async function adminImportGames(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { csv } = CsvImportSchema.parse(req.body);
    const { headers, rows } = parseCSV(csv);

    const required = ['name', 'slug'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length) return next(createError(`Colonnes manquantes : ${missing.join(', ')}`, 400));

    const idx = (h: string) => headers.indexOf(h);
    const errors: string[] = [];
    const upserts: Array<{ id?: string; data: Prisma.GameUncheckedCreateInput }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2;
      const name = row[idx('name')]?.trim();
      const slug = row[idx('slug')]?.trim();
      if (!name) { errors.push(`Ligne ${lineNum} : name requis`); continue; }
      if (!slug) { errors.push(`Ligne ${lineNum} : slug requis`); continue; }
      const id = headers.includes('id') ? row[idx('id')]?.trim() || undefined : undefined;
      upserts.push({
        id,
        data: {
          name,
          slug,
          description: headers.includes('description') ? row[idx('description')]?.trim() || null : undefined,
          icon: headers.includes('icon') ? row[idx('icon')]?.trim() || null : undefined,
          colorMain: headers.includes('colorMain') ? row[idx('colorMain')]?.trim() || '#6366f1' : '#6366f1',
          colorSecondary: headers.includes('colorSecondary') ? row[idx('colorSecondary')]?.trim() || '#818cf8' : '#818cf8',
          active: headers.includes('active') ? row[idx('active')]?.trim().toLowerCase() === 'true' : undefined,
          order: headers.includes('order') ? parseInt(row[idx('order')]) || 0 : undefined,
        },
      });
    }

    if (errors.length) return next(createError(errors.join('\n'), 422));

    const result = await prisma.$transaction(async (tx) => {
      let created = 0; let updated = 0;
      for (const { id, data } of upserts) {
        if (id) {
          const exists = await tx.game.findUnique({ where: { id } });
          if (exists) { await tx.game.update({ where: { id }, data }); updated++; }
          else { await tx.game.create({ data: { ...data, id } }); created++; }
        } else {
          await tx.game.create({ data: data as Prisma.GameUncheckedCreateInput });
          created++;
        }
      }
      return { created, updated };
    });

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function adminImportCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { csv } = CsvImportSchema.parse(req.body);
    const { headers, rows } = parseCSV(csv);

    const required = ['gameId', 'name', 'slug'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length) return next(createError(`Colonnes manquantes : ${missing.join(', ')}`, 400));

    const idx = (h: string) => headers.indexOf(h);
    const errors: string[] = [];
    const upserts: Array<{ id?: string; data: Prisma.CategoryUncheckedCreateInput }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2;
      const gameId = row[idx('gameId')]?.trim();
      const name = row[idx('name')]?.trim();
      const slug = row[idx('slug')]?.trim();
      if (!gameId) { errors.push(`Ligne ${lineNum} : gameId requis`); continue; }
      if (!name) { errors.push(`Ligne ${lineNum} : name requis`); continue; }
      if (!slug) { errors.push(`Ligne ${lineNum} : slug requis`); continue; }
      const id = headers.includes('id') ? row[idx('id')]?.trim() || undefined : undefined;
      upserts.push({
        id,
        data: {
          gameId,
          name,
          slug,
          description: headers.includes('description') ? row[idx('description')]?.trim() || null : undefined,
          order: headers.includes('order') ? parseInt(row[idx('order')]) || 0 : undefined,
        },
      });
    }

    if (errors.length) return next(createError(errors.join('\n'), 422));

    const gameIds = [...new Set(upserts.map((u) => u.data.gameId as string))];
    const existingGames = await prisma.game.findMany({ where: { id: { in: gameIds } }, select: { id: true } });
    const existingGameIds = new Set(existingGames.map((g) => g.id));
    const badGameIds = gameIds.filter((id) => !existingGameIds.has(id));
    if (badGameIds.length) return next(createError(`gameId inconnu(s) : ${badGameIds.join(', ')}`, 422));

    const result = await prisma.$transaction(async (tx) => {
      let created = 0; let updated = 0;
      for (const { id, data } of upserts) {
        if (id) {
          const exists = await tx.category.findUnique({ where: { id } });
          if (exists) { await tx.category.update({ where: { id }, data }); updated++; }
          else { await tx.category.create({ data: { ...data, id } }); created++; }
        } else {
          await tx.category.create({ data: data as Prisma.CategoryUncheckedCreateInput });
          created++;
        }
      }
      return { created, updated };
    });

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function adminImportCards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { csv } = CsvImportSchema.parse(req.body);
    const { headers, rows } = parseCSV(csv);

    const required = ['categoryId', 'text'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length) return next(createError(`Colonnes manquantes : ${missing.join(', ')}`, 400));

    const idx = (h: string) => headers.indexOf(h);
    const errors: string[] = [];
    const upserts: Array<{ id?: string; data: Prisma.CardUncheckedCreateInput }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2;
      const categoryId = row[idx('categoryId')]?.trim();
      const text = row[idx('text')]?.trim();
      if (!categoryId) { errors.push(`Ligne ${lineNum} : categoryId requis`); continue; }
      if (!text) { errors.push(`Ligne ${lineNum} : text requis`); continue; }
      const rawDiff = headers.includes('difficulty') ? row[idx('difficulty')]?.trim() : '';
      const difficulty = rawDiff === 'easy' || rawDiff === 'medium' || rawDiff === 'hard' ? rawDiff : null;
      const id = headers.includes('id') ? row[idx('id')]?.trim() || undefined : undefined;
      upserts.push({
        id,
        data: {
          categoryId,
          text,
          difficulty,
          tags: headers.includes('tags') ? row[idx('tags')]?.split('|').map((t) => t.trim()).filter(Boolean) ?? [] : [],
          active: headers.includes('active') ? row[idx('active')]?.trim().toLowerCase() === 'true' : true,
          order: headers.includes('order') ? parseInt(row[idx('order')]) || 0 : 0,
        },
      });
    }

    if (errors.length) return next(createError(errors.join('\n'), 422));

    const categoryIds = [...new Set(upserts.map((u) => u.data.categoryId as string))];
    const existingCats = await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true } });
    const existingCatIds = new Set(existingCats.map((c) => c.id));
    const badCatIds = categoryIds.filter((id) => !existingCatIds.has(id));
    if (badCatIds.length) return next(createError(`categoryId inconnu(s) : ${badCatIds.join(', ')}`, 422));

    const result = await prisma.$transaction(async (tx) => {
      let created = 0; let updated = 0;
      for (const { id, data } of upserts) {
        if (id) {
          const exists = await tx.card.findUnique({ where: { id } });
          if (exists) { await tx.card.update({ where: { id }, data }); updated++; }
          else { await tx.card.create({ data: { ...data, id } }); created++; }
        } else {
          await tx.card.create({ data: data as Prisma.CardUncheckedCreateInput });
          created++;
        }
      }
      return { created, updated };
    });

    res.json({ success: true, data: result });
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

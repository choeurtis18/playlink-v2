export const dynamic = 'force-dynamic';
import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

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

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const { searchParams } = request.nextUrl;
    const gameId = searchParams.get('gameId');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (gameId) where.category = { gameId };
    if (search) where.text = { contains: search, mode: 'insensitive' };
    const cards = await prisma.card.findMany({ where, orderBy: { order: 'asc' } });
    const headers = ['id', 'categoryId', 'text', 'difficulty', 'tags', 'active', 'order'];
    const rows = cards.map((c) => [c.id, c.categoryId, c.text, c.difficulty, c.tags.join('|'), c.active, c.order]);
    const lines = [headers.join(','), ...rows.map(rowToCSV)].join('\n');
    return new Response('﻿' + lines, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="cards.csv"',
      },
    });
  } catch (err) {
    return apiError(err);
  }
}

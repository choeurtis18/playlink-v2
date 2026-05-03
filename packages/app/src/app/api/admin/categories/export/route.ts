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
    const gameId = request.nextUrl.searchParams.get('gameId');
    const where = gameId ? { gameId } : {};
    const categories = await prisma.category.findMany({ where, orderBy: { order: 'asc' } });
    const headers = ['id', 'gameId', 'name', 'slug', 'description', 'order'];
    const rows = categories.map((c) => [c.id, c.gameId, c.name, c.slug, c.description, c.order]);
    const lines = [headers.join(','), ...rows.map(rowToCSV)].join('\n');
    return new Response('﻿' + lines, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="categories.csv"',
      },
    });
  } catch (err) {
    return apiError(err);
  }
}

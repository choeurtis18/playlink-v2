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
    const games = await prisma.game.findMany({ orderBy: { order: 'asc' } });
    const headers = ['id', 'name', 'slug', 'description', 'icon', 'colorMain', 'colorSecondary', 'active', 'order'];
    const rows = games.map((g) => [g.id, g.name, g.slug, g.description, g.icon, g.colorMain, g.colorSecondary, g.active, g.order]);
    const lines = [headers.join(','), ...rows.map(rowToCSV)].join('\n');
    return new Response('﻿' + lines, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="games.csv"',
      },
    });
  } catch (err) {
    return apiError(err);
  }
}

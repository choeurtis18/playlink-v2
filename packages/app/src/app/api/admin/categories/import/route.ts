export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError, createError } from '@/lib/api-utils/error-handler';
import { requireAuth } from '@/lib/api-utils/auth';

const CsvImportSchema = z.object({ csv: z.string().min(1) });

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

function parseCSV(text: string) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const semicolons = (lines[0].match(/;/g) ?? []).length;
  const commas = (lines[0].match(/,/g) ?? []).length;
  const sep = semicolons > commas ? ';' : ',';
  const headers = parseCSVLine(lines[0], sep);
  const rows = lines.slice(1).map((l) => parseCSVLine(l, sep));
  return { headers, rows };
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const { csv } = CsvImportSchema.parse(await request.json());
    const { headers, rows } = parseCSV(csv);

    const required = ['gameId', 'name', 'slug'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length) throw createError(`Colonnes manquantes : ${missing.join(', ')}`, 400);

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
          gameId, name, slug,
          description: headers.includes('description') ? row[idx('description')]?.trim() || null : undefined,
          order: headers.includes('order') ? parseInt(row[idx('order')]) || 0 : undefined,
        },
      });
    }

    if (errors.length) throw createError(errors.join('\n'), 422);

    const gameIds = [...new Set(upserts.map((u) => u.data.gameId as string))];
    const existingGames = await prisma.game.findMany({ where: { id: { in: gameIds } }, select: { id: true } });
    const existingGameIds = new Set(existingGames.map((g) => g.id));
    const badGameIds = gameIds.filter((id) => !existingGameIds.has(id));
    if (badGameIds.length) throw createError(`gameId inconnu(s) : ${badGameIds.join(', ')}`, 422);

    let created = 0; let updated = 0;
    for (const { id, data } of upserts) {
      try {
        if (id) {
          const exists = await prisma.category.findUnique({ where: { id } });
          if (exists) { await prisma.category.update({ where: { id }, data }); updated++; }
          else { await prisma.category.create({ data: { ...data, id } }); created++; }
        } else {
          await prisma.category.create({ data: data as Prisma.CategoryUncheckedCreateInput });
          created++;
        }
      } catch (e) {
        console.error(`Failed to upsert category: ${id || data.name}`, e);
      }
    }
    const result = { created, updated };

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return apiError(err);
  }
}

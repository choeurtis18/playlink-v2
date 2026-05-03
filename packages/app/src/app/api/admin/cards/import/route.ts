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

    const required = ['categoryId', 'text'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length) throw createError(`Colonnes manquantes : ${missing.join(', ')}`, 400);

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
          categoryId, text, difficulty,
          tags: headers.includes('tags') ? row[idx('tags')]?.split('|').map((t) => t.trim()).filter(Boolean) ?? [] : [],
          active: headers.includes('active') ? row[idx('active')]?.trim().toLowerCase() === 'true' : true,
          order: headers.includes('order') ? parseInt(row[idx('order')]) || 0 : 0,
        },
      });
    }

    if (errors.length) throw createError(errors.join('\n'), 422);

    const categoryIds = [...new Set(upserts.map((u) => u.data.categoryId as string))];
    const existingCats = await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true } });
    const existingCatIds = new Set(existingCats.map((c) => c.id));
    const badCatIds = categoryIds.filter((id) => !existingCatIds.has(id));
    if (badCatIds.length) throw createError(`categoryId inconnu(s) : ${badCatIds.join(', ')}`, 422);

    let created = 0; let updated = 0;
    for (const { id, data } of upserts) {
      try {
        if (id) {
          const exists = await prisma.card.findUnique({ where: { id } });
          if (exists) { await prisma.card.update({ where: { id }, data }); updated++; }
          else { await prisma.card.create({ data: { ...data, id } }); created++; }
        } else {
          await prisma.card.create({ data: data as Prisma.CardUncheckedCreateInput });
          created++;
        }
      } catch (e) {
        console.error(`Failed to upsert card: ${id || data.text}`, e);
      }
    }
    const result = { created, updated };

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return apiError(err);
  }
}

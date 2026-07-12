import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_DIR = path.join(__dirname, '../../../Cartes - Catégories');

const GAMES = [
  {
    id: 'cmpokzb200000oef9iafu0gpk',
    name: 'Action ou Vérité',
    slug: 'action-ou-verite',
    description: 'Le classique revisité — vérités pimentées ou défis fous !',
    icon: '🎯',
    colorMain: '#7C3AED',
    colorSecondary: '#EC4899',
    order: 0,
    categoriesFile: 'Action ou Verite/Action ou Verite Categories June 2026.csv',
    cardsFile: 'Action ou Verite/Action ou Verite Cartes - June 2026.csv',
    cardSep: ';',
  },
  {
    id: 'cmpokzc24001hoef9ptz1hzmq',
    name: 'Icebreaker',
    slug: 'icebreaker',
    description: 'Brise la glace avec des questions qui créent des vraies connexions.',
    icon: '🧊',
    colorMain: '#0EA5E9',
    colorSecondary: '#06B6D4',
    order: 1,
    categoriesFile: 'Icebreaker/Icebreaker Categories June 2026.csv',
    cardsFile: 'Icebreaker/Icebreaker Cartes June 2026.csv',
    cardSep: ',',
  },
  {
    id: 'cmpokzcx2002ooef9wdoxs0u2',
    name: 'Dégat Débat',
    slug: 'degat-debat',
    description: 'Des débats qui font réfléchir — et parfois chauffer !',
    icon: '🔥',
    colorMain: '#DC2626',
    colorSecondary: '#F97316',
    order: 2,
    categoriesFile: 'Dégat débat/Degat Debat Categories Jun 06 2026.csv',
    cardsFile: 'Dégat débat/Dégat Débat Juin 2026.csv',
    cardSep: ',',
  },
  {
    id: 'cmpokzdpj003roef9zrecwxjn',
    name: 'Balance ton pote',
    slug: 'balance-ton-pote',
    description: 'Révèle ce que tu penses vraiment de tes amis !',
    icon: '👀',
    colorMain: '#059669',
    colorSecondary: '#10B981',
    order: 3,
    categoriesFile: 'Balance ton pote/Balance ton pote - Categories.csv',
    cardsFile: 'Balance ton pote/Balance ton pote 2026-06-06.csv',
    cardSep: ',',
  },
  {
    id: 'cmpokzehw004woef9j5e0e02u',
    name: 'Mime Inversé',
    slug: 'mime-inverse',
    description: 'Fais deviner sans parler — mais à l\'envers !',
    icon: '🎭',
    colorMain: '#D97706',
    colorSecondary: '#F59E0B',
    order: 4,
    categoriesFile: 'Mime Inverse/categories-mime-inversé-2026-06-06.csv',
    cardsFile: 'Mime Inverse/Cartes Mime Inversé Jun 6 2026.csv',
    cardSep: ',',
  },
  {
    id: 'cmpokzf9x007doef95r04egfg',
    name: 'Devine le Mot',
    slug: 'devine-le-mot',
    description: 'Décris le mot sans le dire — facile à dire !',
    icon: '💬',
    colorMain: '#7C3AED',
    colorSecondary: '#8B5CF6',
    order: 5,
    categoriesFile: 'Devine le Mot/Devine Le Mot Categories June 2026.csv',
    cardsFile: 'Devine le Mot/Devine le Mot June 6 2026.csv',
    cardSep: ',',
  },
  {
    id: 'cmpdilemme00000oef9000000',
    name: 'Dilemme',
    slug: 'dilemme',
    description: 'Choisis entre deux options impossibles — et assume !',
    icon: '⚖️',
    colorMain: '#1D4ED8',
    colorSecondary: '#3B82F6',
    order: 6,
    categoriesFile: 'Dilemme/Dilemme Categories June 2026.csv',
    cardsFile: 'Dilemme/Dilemme Cartes June 2026.csv',
    cardSep: ',',
  },
  {
    id: 'cmq2jakh8014cx33lkmobn4gq',
    name: 'Roland Gamos',
    slug: 'roland-gamos',
    description: 'Trouve la connexion entre deux célébrités !',
    icon: '🌟',
    colorMain: '#BE185D',
    colorSecondary: '#EC4899',
    order: 7,
    categoriesFile: 'Roland Gamos/Categories Roland Gamos Jun 06 2026.csv',
    cardsFile: 'Roland Gamos/Cartes Roland Gamos June 2026.csv',
    cardSep: ',',
  },
];

function parseCSV(filePath: string, sep: string) {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(sep).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(sep).map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

async function main() {
  console.log('🗑️  Clearing existing data...');
  await prisma.card.deleteMany();
  await prisma.category.deleteMany();
  await prisma.gameRules.deleteMany();
  await prisma.game.deleteMany();

  for (const game of GAMES) {
    console.log(`\n🎮 Importing ${game.name}...`);

    await prisma.game.create({
      data: {
        id: game.id,
        name: game.name,
        slug: game.slug,
        description: game.description,
        icon: game.icon,
        colorMain: game.colorMain,
        colorSecondary: game.colorSecondary,
        order: game.order,
        active: true,
      },
    });

    const categoriesPath = path.join(DATA_DIR, game.categoriesFile);
    const categoriesRaw = parseCSV(categoriesPath, ',');

    for (const cat of categoriesRaw) {
      await prisma.category.create({
        data: {
          id: cat.id,
          gameId: game.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          order: parseInt(cat.order) || 0,
        },
      });
    }
    console.log(`  ✓ ${categoriesRaw.length} categories`);

    const cardsPath = path.join(DATA_DIR, game.cardsFile);
    const cardsRaw = parseCSV(cardsPath, game.cardSep);

    let cardCount = 0;
    for (const card of cardsRaw) {
      const active = card.active?.toLowerCase() === 'true';
      if (!active) continue;
      const tags = card.tags ? card.tags.split('|').map((t: string) => t.trim()).filter(Boolean) : [];
      await prisma.card.create({
        data: {
          id: card.id,
          categoryId: card.categoryId,
          text: card.text,
          difficulty: card.difficulty?.toLowerCase() || null,
          tags,
          active: true,
          order: parseInt(card.order) || 0,
        },
      });
      cardCount++;
    }
    console.log(`  ✓ ${cardCount} cards`);
  }

  console.log('\n✅ Import complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

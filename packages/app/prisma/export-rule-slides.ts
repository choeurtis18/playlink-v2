// Exporte les slides de règles depuis la base (lecture seule) vers src/db/rule-slides.generated.ts,
// pour que le seed reflète exactement ce qui a été saisi dans le back-office.
// Usage : pnpm --filter @playlink/app db:export-slides  (lit DATABASE_URL dans .env.local)
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OUTPUT = resolve(__dirname, '../src/db/rule-slides.generated.ts');

async function main() {
  const games = await prisma.game.findMany({
    orderBy: { order: 'asc' },
    select: {
      slug: true,
      ruleSlides: {
        orderBy: { order: 'asc' },
        select: { id: true, order: true, title: true, content: true, imageUrl: true },
      },
    },
  });

  const slides = Object.fromEntries(games.filter((g) => g.ruleSlides.length > 0).map((g) => [g.slug, g.ruleSlides]));

  writeFileSync(
    OUTPUT,
    `// Fichier généré par prisma/export-rule-slides.ts — ne pas modifier à la main.\n` +
      `// Source : back-office (table game_rule_slides), exporté le ${new Date().toISOString().slice(0, 10)}.\n` +
      `import type { RuleSlideSeed } from './seed-new-games';\n\n` +
      `export const gameRuleSlides: Record<string, RuleSlideSeed[]> = ${JSON.stringify(slides, null, 2)};\n`,
  );

  for (const [slug, list] of Object.entries(slides)) console.log(`  ${slug} : ${list.length} slides`);
  console.log(`✓ ${OUTPUT}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

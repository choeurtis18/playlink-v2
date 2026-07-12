import { PrismaClient } from '@prisma/client';
import { normalizeTags } from '../src/lib/tag-mapping';

const prisma = new PrismaClient();

async function main() {
  const cards = await prisma.card.findMany({ select: { id: true, tags: true } });
  let updated = 0;
  let unchanged = 0;

  for (const card of cards) {
    const normalized = normalizeTags(card.tags);
    if (
      normalized.length === card.tags.length &&
      normalized.every((t, i) => t === card.tags[i])
    ) {
      unchanged++;
      continue;
    }
    await prisma.card.update({ where: { id: card.id }, data: { tags: normalized } });
    updated++;
  }

  console.log(`✅ ${updated} cards updated, ${unchanged} unchanged`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

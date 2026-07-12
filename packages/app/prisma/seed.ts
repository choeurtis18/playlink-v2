import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BADGES = [
  { key: 'first_win', name: 'Première victoire', description: 'Remporter sa première partie', icon: '🏆' },
  { key: 'party_legend', name: 'Légende de soirée', description: 'Atteindre 20 victoires au total', icon: '👑' },
  { key: 'social_butterfly', name: 'Papillon social', description: 'Jouer 5 parties avec 4 joueurs ou plus', icon: '🦋' },
  { key: 'truth_seeker', name: 'Chercheur de vérité', description: 'Gagner 10 cartes "vérité"', icon: '🔍' },
  { key: 'three_peat', name: 'Triplé', description: '3 victoires consécutives dans une même session', icon: '🔥' },
];

async function main() {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: badge,
      create: badge,
    });
  }
  console.log(`Seeded ${BADGES.length} badges`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

import { INTENSITY_WEIGHT_EXPONENT } from '@playlink/shared';

/**
 * Poids d'une carte selon sa distance à l'intensité visée.
 * Distance 0 → 1, distance 1 → ~0.35, distance 4 → ~0.09 (avec k = 1.5).
 * Aucune carte n'a un poids nul : le deck n'est jamais vide, même si la
 * catégorie ne contient aucune carte à l'intensité demandée.
 */
export function intensityWeight(cardIntensity: number, target: number): number {
  const distance = Math.abs(cardIntensity - target);
  return 1 / Math.pow(1 + distance, INTENSITY_WEIGHT_EXPONENT);
}

/**
 * Tirage pondéré sans remise : sélectionne `count` cartes en favorisant
 * celles proches de `target`, sans jamais exclure les autres.
 */
export function pickWeighted<T extends { intensity?: number }>(
  cards: T[],
  target: number,
  count: number,
): T[] {
  const pool = [...cards];
  const weights = pool.map((c) => intensityWeight(c.intensity ?? 3, target));
  const picked: T[] = [];

  while (picked.length < count && pool.length > 0) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let r = Math.random() * total;
    let index = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) { index = i; break; }
    }
    picked.push(pool[index]);
    pool.splice(index, 1);
    weights.splice(index, 1);
  }

  return picked;
}

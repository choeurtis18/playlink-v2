import { z } from 'zod';

export const CardSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  text: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
  active: z.boolean(),
  order: z.number(),
});

export const CategorySchema = z.object({
  id: z.string(),
  gameId: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  cards: z.array(CardSchema),
  order: z.number(),
});

export const GameSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  colorMain: z.string().regex(/^#[0-9A-F]{6}$/i),
  colorSecondary: z.string().regex(/^#[0-9A-F]{6}$/i),
  active: z.boolean(),
  order: z.number(),
  categories: z.array(CategorySchema),
});

export const CreateGameSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  colorMain: z.string().regex(/^#[0-9A-F]{6}$/i),
  colorSecondary: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export const CreateCategorySchema = z.object({
  gameId: z.string(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const CreateCardSchema = z.object({
  categoryId: z.string(),
  text: z.string().min(1).max(500),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
});

export type Card = z.infer<typeof CardSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Game = z.infer<typeof GameSchema>;
export type CreateGamePayload = z.infer<typeof CreateGameSchema>;
export type CreateCategoryPayload = z.infer<typeof CreateCategorySchema>;
export type CreateCardPayload = z.infer<typeof CreateCardSchema>;

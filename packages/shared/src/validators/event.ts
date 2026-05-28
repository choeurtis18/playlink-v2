import { z } from 'zod';

export const EventSchema = z.object({
  type: z.enum(['game_started', 'card_viewed', 'game_finished']),
  gameId: z.string().optional(),
  categoryId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type EventInput = z.infer<typeof EventSchema>;

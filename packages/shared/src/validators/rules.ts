import { z } from 'zod';

export const RulesSchema = z.object({
  rules: z.string().min(10, 'Minimum 10 caractères').max(5000, 'Maximum 5000 caractères'),
});

export type RulesInput = z.infer<typeof RulesSchema>;

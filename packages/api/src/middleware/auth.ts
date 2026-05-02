import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { createError } from './errorHandler.js';

const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_KEY ?? '',
);

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(createError('Missing or invalid Authorization header', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.slice(7);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return next(createError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }

  // Attach user to request for downstream use
  (req as Request & { user: typeof data.user }).user = data.user;
  next();
}

import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { createError } from './errorHandler.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    `Supabase configuration missing: URL=${!!supabaseUrl}, SERVICE_KEY=${!!supabaseServiceKey}`
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(createError('Missing or invalid Authorization header', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.slice(7);

  let data: Awaited<ReturnType<typeof supabase.auth.getUser>>['data'];
  let error: Awaited<ReturnType<typeof supabase.auth.getUser>>['error'];

  try {
    ({ data, error } = await supabase.auth.getUser(token));
  } catch {
    return next(createError('Authentication service unavailable', 503, 'AUTH_UNAVAILABLE'));
  }

  if (error || !data.user) {
    return next(createError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }

  req.user = data.user;
  next();
}

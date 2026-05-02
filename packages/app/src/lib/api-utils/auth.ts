import { type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createError } from './error-handler';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    `Supabase configuration missing: URL=${!!supabaseUrl}, SERVICE_KEY=${!!supabaseServiceKey}`
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError('Missing or invalid Authorization header', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.slice(7);

  let data: Awaited<ReturnType<typeof supabase.auth.getUser>>['data'];
  let error: Awaited<ReturnType<typeof supabase.auth.getUser>>['error'];

  try {
    ({ data, error } = await supabase.auth.getUser(token));
  } catch {
    throw createError('Authentication service unavailable', 503, 'AUTH_UNAVAILABLE');
  }

  if (error || !data.user) {
    throw createError('Invalid or expired token', 401, 'UNAUTHORIZED');
  }

  return data.user;
}

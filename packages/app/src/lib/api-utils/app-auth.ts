import { type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from './prisma';
import { createError } from './error-handler';

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw createError('Supabase configuration missing', 503, 'CONFIG_ERROR');
  return createClient(url, key);
}

export async function requireAppAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError('Missing or invalid Authorization header', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.slice(7);
  const supabase = getSupabaseClient();

  let supabaseUser: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw createError('Invalid or expired token', 401, 'UNAUTHORIZED');
    supabaseUser = data.user;
  } catch (e) {
    if ((e as { code?: string }).code === 'UNAUTHORIZED') throw e;
    throw createError('Authentication service unavailable', 503, 'AUTH_UNAVAILABLE');
  }

  const appUser = await prisma.appUser.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  if (!appUser) {
    throw createError('App user not found', 404, 'APP_USER_NOT_FOUND');
  }

  return appUser;
}

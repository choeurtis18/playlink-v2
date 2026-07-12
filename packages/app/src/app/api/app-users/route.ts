export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/api-utils/prisma';
import { apiError } from '@/lib/api-utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const existing = await prisma.appUser.findUnique({
      where: { supabaseId: data.user.id },
    });

    if (existing) {
      return NextResponse.json({ data: existing });
    }

    const appUser = await prisma.appUser.create({
      data: {
        supabaseId: data.user.id,
        email: data.user.email!,
      },
    });

    return NextResponse.json({ data: appUser }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}

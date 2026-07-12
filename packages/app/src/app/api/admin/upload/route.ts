export const dynamic = 'force-dynamic';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/api-utils/auth';
import { apiError } from '@/lib/api-utils/error-handler';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const ext = file.name.split('.').pop() ?? 'bin';
    const fileName = `rule-slides/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from('game-assets')
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from('game-assets').getPublicUrl(fileName);
    return NextResponse.json({ data: { url: urlData.publicUrl } }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}

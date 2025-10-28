import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(url, anon);

export async function GET() {
  const { data, error } = await supabase.from('products').select('*').eq('is_deleted', false).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const images: string[] = Array.isArray(body.images) ? body.images : [];
    const image: string | null = body.image ?? (images[0] ?? null);
    const payload = { ...body, images, image };
    const { data, error } = await supabase.from('products').insert(payload).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}



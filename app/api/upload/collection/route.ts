import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/utils/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const contentType = file.type || 'application/octet-stream';
    if (!allowed.includes(contentType)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'bin';
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const objectPath = `collections/${filename}`;

    const { error } = await supabaseServerClient.storage
      .from('collection-banners')
      .upload(objectPath, bytes, { contentType, upsert: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data } = supabaseServerClient.storage
      .from('collection-banners')
      .getPublicUrl(objectPath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}



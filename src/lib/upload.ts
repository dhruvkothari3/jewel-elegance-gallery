import { supabase } from '@/integrations/supabase/client';

export async function uploadImageAndGetUrl(file?: File, bucket: string = 'product-images'): Promise<string | undefined> {
  if (!file) return undefined;
  const form = new FormData();
  form.append('file', file);
  form.append('bucket', bucket);

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('https://ocsxroatjiagcmqqsyee.supabase.co/functions/v1/upload-image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  const { url } = await res.json();
  return url;
}




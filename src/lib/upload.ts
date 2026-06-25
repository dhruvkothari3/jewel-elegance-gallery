import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an image to a Supabase storage bucket via the `upload-image` edge function
 * and returns the public URL. Uses supabase.functions.invoke so the request is
 * always routed to the currently connected Supabase project.
 */
export async function uploadImageAndGetUrl(
  file?: File,
  bucket: string = 'product-images'
): Promise<string | undefined> {
  if (!file) return undefined;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error('You must be signed in to upload images.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('bucket', bucket);

  const { data, error } = await supabase.functions.invoke('upload-image', {
    body: form,
  });

  if (error) {
    throw new Error(error.message || 'Image upload failed');
  }
  if (!data?.url) {
    throw new Error('Upload succeeded but no URL was returned');
  }
  return data.url as string;
}

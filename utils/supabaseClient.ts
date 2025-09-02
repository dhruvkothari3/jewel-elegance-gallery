import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role for privileged storage writes.
// Ensure the following env variables are set in your Next.js environment:
// - SUPABASE_URL: https://<ref>.supabase.co
// - SUPABASE_SERVICE_ROLE_KEY: ey... (service role key)

const supabaseUrl = process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !/^https?:\/\//.test(supabaseUrl)) {
  // eslint-disable-next-line no-console
  console.warn('SUPABASE_URL is missing or invalid. File uploads will fail.');
}
if (!serviceRoleKey || !serviceRoleKey.startsWith('ey')) {
  // eslint-disable-next-line no-console
  console.warn('SUPABASE_SERVICE_ROLE_KEY is missing or invalid. File uploads will fail.');
}

export const supabaseServerClient: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);



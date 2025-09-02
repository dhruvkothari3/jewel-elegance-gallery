const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'product-images';

let supabaseClient = null;
function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }
  return supabaseClient;
}

async function uploadBufferAndGetPublicUrl({ buffer, mimeType, folder = 'general', filename }) {
  const client = getSupabase();
  const ext = mimeType?.split('/')[1] || 'bin';
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '');
  const unique = filename || `${randomUUID()}.${ext}`;
  const objectPath = `${safeFolder}/${unique}`;

  if (client) {
    const { error } = await client.storage
      .from(SUPABASE_BUCKET)
      .upload(objectPath, buffer, { contentType: mimeType || 'application/octet-stream', upsert: false });
    if (error) throw new Error(error.message);
    const { data } = client.storage.from(SUPABASE_BUCKET).getPublicUrl(objectPath);
    return data.publicUrl;
  }

  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const subDir = path.join(uploadsDir, safeFolder);
  if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
  const filePath = path.join(subDir, unique);
  await fs.promises.writeFile(filePath, buffer);
  const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
  return `${baseUrl}/uploads/${safeFolder}/${unique}`;
}

module.exports = { uploadBufferAndGetPublicUrl };




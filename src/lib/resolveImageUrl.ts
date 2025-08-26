import { supabase } from '../../lib/supabaseClient';

// Build a public URL for a Supabase storage object in the 'products' bucket.
export function buildSupabasePublicUrl(path: string) {
  if (!path) return null;
  // If already a full URL, return as-is
  if (path.startsWith('http')) return path;
  return `https://ktpajrnflcqwgaoaywuu.supabase.co/storage/v1/object/public/products/${path}`;
}

// Note: we avoid network HEAD requests here to keep this helper sync and safe for SSR.
// Components should use this to construct the URL and optionally perform client-side
// verification (fetch/HEAD) if needed.
export default buildSupabasePublicUrl;

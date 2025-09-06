// Utilidad para construir la URL pública de una imagen almacenada en Supabase Storage
// Si la imagen ya es una URL absoluta, la retorna igual
// Si es una ruta relativa, la convierte usando las variables de entorno

export function buildSupabasePublicUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Ajusta el bucket y la ruta según tu estructura
  const bucket = 'productos'; // Cambia si usas otro bucket
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return path;

  // Elimina prefijo public/ si existe
  let cleanPath = path.replace(/^public\//, '');
  // Si la ruta ya incluye el bucket, no lo dupliques
  if (cleanPath.startsWith(bucket + '/')) {
    cleanPath = cleanPath.substring(bucket.length + 1);
  }

  return `${baseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

// /types/boom.ts

// ====== Tipo tal cual viene de SUPABASE (DB) ======
export interface BoomRow {
  id: string;
  title: string | null;
  description: string | null;
  video_url: string;            // URL pública completa del video
  poster_url?: string | null;   // URL pública completa del póster (puede ser null)
  is_published: boolean;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  views_count: number;
  shares_count: number;
  created_at: string;           // ISO
}

// ====== Tipo que consume tu UI (componentes del feed) ======
export interface BoomUI {
  id: string;
  video: string;                // antes boom.video
  cover?: string | null;        // antes boom.cover
  title: string;
  user?: string | null;         // opcional (si no lo tienes en DB)
  likes: number;
  created_at: string;
}

// ====== Mapper DB -> UI ======
export const mapRowToUI = (r: BoomRow): BoomUI => ({
  id: r.id,
  video: r.video_url,
  cover: r.poster_url ?? null,
  title: r.title ?? "Boom",
  user: null,                   // cámbialo a r.user ?? "Dozur" si agregas columna en DB
  likes: r.likes_count ?? 0,
  created_at: r.created_at,
});
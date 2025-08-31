"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback } from "react";
import { useBoomStore } from "../../../store/boomStore"; // ajusta si tu ruta difiere

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- auth mínima (devuelve { userId } o null) ---
async function requireAuth(): Promise<{ userId: string } | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { userId: data.user.id };
}

// --- refresca los contadores del boom idx leyendo booms_feed ---
async function fetchCounters(boomId: string) {
  const { data, error } = await supabase
    .from("booms_feed")
    .select(
      "likes_count, saves_count, views_count, shares_count, comments_count"
    )
    .eq("id", boomId)
    .maybeSingle();

  if (error) {
    console.warn("refresh counters error:", error.message);
    return null;
  }
  return data;
}

export const useBoomActions = () => {
  const {
    booms,
    liked,
    saved,
    likeOptimistic,
    unlikeOptimistic,
    saveOptimistic,
    unsaveOptimistic,
    updateBoom,
  } = useBoomStore();

  // ---------------- Like ----------------
  const handleLike = useCallback(
    async (boomId: string) => {
      const b = booms[boomId];
      if (!b) return;

      const auth = await requireAuth();
      if (!auth) {
        alert("Inicia sesión para dar like");
        return;
      }

      const alreadyLiked = liked.get(boomId) === "on";

      // 1) UI optimista: cambiar estado y contador inmediatamente
      if (!alreadyLiked) likeOptimistic(boomId);
      else unlikeOptimistic(boomId);

      try {
        if (!alreadyLiked) {
          // dar like
          const { error } = await supabase.from("boom_likes").insert({
            boom_id: b.id,
            user_id: auth.userId,
          });
          if (error) throw error;
        } else {
          // quitar like
          const { error } = await supabase
            .from("boom_likes")
            .delete()
            .match({ boom_id: b.id, user_id: auth.userId });
          if (error) throw error;
        }
      } catch (e: any) {
        console.warn("like error:", e?.message || e);
        // 2) rollback si falló
        if (!alreadyLiked) unlikeOptimistic(boomId);
        else likeOptimistic(boomId);
      } finally {
        // 3) sincronizar contadores reales desde la vista booms_feed
        const counters = await fetchCounters(b.id);
        if (counters)
          updateBoom(b.id, {
            likes: counters.likes_count ?? b.likes,
            saves: counters.saves_count ?? b.saves,
            views: counters.views_count ?? b.views,
            shares: counters.shares_count ?? b.shares,
            comments: counters.comments_count ?? b.comments,
          });
      }
    },
    [booms, liked, likeOptimistic, unlikeOptimistic, updateBoom]
  );
  // ---------------- Save ----------------
  const handleSave = useCallback(
    async (boomId: string) => {
      const b = booms[boomId];
      if (!b) return;

      const auth = await requireAuth();
      if (!auth) {
        alert("Inicia sesión para guardar");
        return;
      }

      const alreadySaved = saved.get(boomId) === "on";

      // Optimistic UI
      if (!alreadySaved) saveOptimistic(boomId);
      else unsaveOptimistic(boomId);

      try {
        if (!alreadySaved) {
          const { error } = await supabase.from("boom_saves").insert({
            boom_id: b.id,
            user_id: auth.userId,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("boom_saves")
            .delete()
            .match({ boom_id: b.id, user_id: auth.userId });
          if (error) throw error;
        }
      } catch (e: any) {
        console.warn("save error:", e?.message || e);
        if (!alreadySaved) unsaveOptimistic(boomId);
        else saveOptimistic(boomId);
      } finally {
        const counters = await fetchCounters(b.id);
        if (counters)
          updateBoom(b.id, {
            likes: counters.likes_count ?? b.likes,
            saves: counters.saves_count ?? b.saves,
            views: counters.views_count ?? b.views,
            shares: counters.shares_count ?? b.shares,
            comments: counters.comments_count ?? b.comments,
          });
      }
    },
    [booms, saved, saveOptimistic, unsaveOptimistic, updateBoom]
  );

  // ---------------- Share ----------------
  const handleShare = useCallback(
    async (boomId: string) => {
      const b = booms[boomId];
      if (!b) return;
      const auth = await requireAuth(); // opcional para permitir shares anónimos

      try {
        // 1) abrir share nativo si existe
        const shareUrl = typeof window !== "undefined" ? window.location.origin + "/booms/" + b.id : "";
        if (navigator?.share) {
          try {
            await navigator.share({
              title: b.title || "Boom",
              text: "Mira este boom",
              url: shareUrl,
            });
          } catch {
            // si el usuario cancela, igual seguimos con el registro
          }
        } else {
          // Si no hay API de compartir, mostrar modal para copiar enlace
          window.prompt("Copia este enlace para compartir:", shareUrl);
        }
        // 2) registrar share
        const { error } = await supabase.from("boom_shares").insert({
          boom_id: b.id,
          user_id: auth?.userId ?? null,
        });
        if (error) throw error;
      } catch (e: any) {
        console.warn("share error:", e?.message || e);
      } finally {
        const counters = await fetchCounters(b.id);
        if (counters) updateBoom(b.id, { shares: counters.shares_count ?? b.shares });
      }
    },
    [booms, updateBoom]
  );

  // ---------------- Comment (placeholder) ----------------
  // Si ya tienes UI de comentarios, llama esta función al enviar:
  const handleComment = useCallback(
    async (boomId: string, text: string) => {
      const b = booms[boomId];
      if (!b) return;

      const auth = await requireAuth();
      if (!auth) {
        alert("Inicia sesión para comentar");
        return;
      }

      try {
        const { error } = await supabase.from("boom_comments").insert({
          boom_id: b.id,
          user_id: auth.userId,
          content: text,
        });
        if (error) throw error;
      } catch (e: any) {
        console.warn("comment error:", e?.message || e);
      } finally {
        const counters = await fetchCounters(b.id);
        if (counters) updateBoom(b.id, { comments: counters.comments_count ?? b.comments });
      }
    },
    [booms, updateBoom]
  );

  // ---------------- Views (1 por sesión por boom) ----------------
  const trackView = useCallback(async (boomId: string) => {
    try {
      const key = `viewed_${boomId}`;
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key))
        return;

      const auth = await requireAuth(); // opcional
      await supabase.from("boom_views").insert({
        boom_id: boomId,
        user_id: auth?.userId ?? null,
        session_id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
      });

      if (typeof sessionStorage !== "undefined") sessionStorage.setItem(key, "1");
    } catch (e: any) {
      console.warn("view error:", e?.message || e);
    }
  }, []);

  return {
    handleLike,
    handleSave,
    handleShare,
    handleComment,
    trackView,
  };
};
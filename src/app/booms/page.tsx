  // (mover este useEffect después de la declaración de visibleIndex y soundEnabled)
"use client";

import BottomDock from "@/components/BottomDock";
import CommentModal from "@/components/CommentModal";
import VideoActions from "@/components/VideoActions";
import VideoFullScreen from "@/components/VideoFullscreen";
import { supabase } from "@/lib/supabaseClient";
import { BoomUI, useBoomStore } from "@/store/boomStore";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Helper to fetch per-user like/save state for a set of boom ids
async function fetchUserInteractions(boomIds: string[], userId: string) {
  // Likes
  const { data: likesData } = await supabase
    .from("boom_likes")
    .select("boom_id")
    .in("boom_id", boomIds)
    .eq("user_id", userId);

  // Saves
  const { data: savesData } = await supabase
    .from("boom_saves")
    .select("boom_id")
    .in("boom_id", boomIds)
    .eq("user_id", userId);

  const liked = new Map<string, "on" | "off">();
  const saved = new Map<string, "on" | "off">();
  boomIds.forEach((id) => {
    liked.set(id, likesData?.some((l) => l.boom_id === id) ? "on" : "off");
    saved.set(id, savesData?.some((s) => s.boom_id === id) ? "on" : "off");
  });
  return { liked, saved };
}

// ---------- Supabase client ----------

// ---------- Helpers ----------
async function requireAuth(): Promise<{ userId: string } | null> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  return user ? { userId: user.id } : null;
}

function mapRowToUI(r: any): BoomUI {
  return {
    id: r.id,
    video: r.video_url,
    cover: r.poster_url ?? null,
    title: r.title ?? "Boom",
    user: r.user ?? "Boom",
    likes: r.likes_count ?? 0,
    saves: r.saves_count ?? 0,
    views: r.views_count ?? 0,
    shares: r.shares_count ?? 0,
    comments: r.comments_count ?? 0,
    created_at: r.created_at,
  };
}

// ============================================
//                COMPONENT
// ============================================
export default function BoomsPage() {
  // Estado para el modal de comentarios
  const [commentModal, setCommentModal] = useState<{ open: boolean; boomId: string | null }>({ open: false, boomId: null });
  const [comments, setComments] = useState<any[]>([]); // Aquí puedes tipar mejor según tu modelo
  const [commentCount, setCommentCount] = useState(0);

  // Cargar comentarios al abrir el modal
  useEffect(() => {
    if (commentModal.open && commentModal.boomId) {
      // Aquí deberías hacer el fetch real a Supabase
      // Ejemplo:
      (async () => {
        const { data, error } = await supabase
          .from("boom_comments")
          .select("id, user_id, content, created_at")
          .eq("boom_id", commentModal.boomId)
          .order("created_at", { ascending: false });
        if (data) {
          // Simula avatares por ahora
          setComments(data.map((c: any) => ({
            id: c.id,
            avatar: "/avatar.jpg", // Aquí deberías mapear el avatar real del usuario
            text: c.content,
            fireCount: 0,
            xCount: 0,
          })));
          setCommentCount(data.length);
        }
      })();
    }
  }, [commentModal]);
  // ---- Config tunable ----
  const PAGE_SIZE = 3;
  const DOUBLE_TAP_MS = 300;
  const NAV_H_PX = 64;
  const OBS_THRESHOLD = 0.72; // visibilidad necesaria para considerar "activa"

  // ---- Store (Zustand) ----
  const {
    booms,
    order,
    liked,
    saved,
    visibleIndex,
    cursor,
    hasMore,
    isFetching,
    setBooms,
    addBooms,
    setVisibleIndex,
    setCursor,
    setHasMore,
    setIsFetching,
  } = useBoomStore();

  // ---- Estado UI local ----
  const [isMobile, setIsMobile] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("booms_sound_enabled") === "1";
  });

  // Refs for video and card elements
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const loadRef = useRef<HTMLDivElement | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  // Forzar reproducción automática del video activo al montar y al cambiar visibleIndex
  useEffect(() => {
    const video = videoRefs.current[visibleIndex];
    if (video) {
      video.muted = !soundEnabled;
      video.volume = soundEnabled ? 1.0 : 0.0;
      // Solo intenta play si no está ya reproduciéndose
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  }, [visibleIndex, soundEnabled]);
  const viewed = useRef<Set<string>>(new Set());

  // Una session_id por sesión de scroll
  const sessionId = useMemo(
    () =>
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`),
    []
  );

  // Mantener sincronía de sonido global al cambiar soundEnabled
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v) {
        v.muted = !soundEnabled;
        v.volume = soundEnabled ? 1.0 : 0.0;
      }
    });
  }, [soundEnabled, visibleIndex]);

  // Doble tap + animación 🔥
  const lastTap = useRef<number>(0);
  const [flames, setFlames] = useState<{ id: number; x: number; y: number }[]>([]);

  // Pausar videos cuando la pestaña se oculta
  useEffect(() => {
    const onVis = () => {
      const v = videoRefs.current[visibleIndex];
      if (!v) return;
      if (document.hidden) v.pause();
      else {
        v.muted = !soundEnabled;
        v.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [visibleIndex, soundEnabled]);

  // --------------------------------------------
  // Preload inteligente (prev/next)
  // --------------------------------------------
  useEffect(() => {
    const prevIdx = Math.max(0, visibleIndex - 1);
    const nextIdx = Math.min(order.length - 1, visibleIndex + 1);

    [prevIdx, nextIdx].forEach((idx) => {
      const video = videoRefs.current[idx];
      if (video && video.readyState < 2) {
        video.preload = "metadata";
        try {
          video.load();
        } catch {}
      }
    });
  }, [visibleIndex, order.length]);

  // --------------------------------------------
  // Windowing: sólo renderizar visibleIndex ± 1
  // --------------------------------------------
  const { start, end } = useMemo(() => {
    const s = Math.max(0, visibleIndex - 1);
    const e = Math.min(order.length - 1, visibleIndex + 1);
    return { start: s, end: e };
  }, [visibleIndex, order.length]);

  // --------------------------------------------
  // Sonido global (primer gesto del usuario)
  // --------------------------------------------
  const enableGlobalSound = () => {
    if (soundEnabled) return;
    setSoundEnabled(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("booms_sound_enabled", "1");
    }
    // Desmutear todos los videos
    videoRefs.current.forEach((v) => {
      if (v) {
        v.muted = false;
        v.volume = 1.0;
      }
    });
    // Forzar play en el video visible
    const activeVideo = videoRefs.current[visibleIndex];
    if (activeVideo) {
      activeVideo.muted = false;
      activeVideo.volume = 1.0;
      activeVideo.play().catch(() => {});
    }
  };

  // --------------------------------------------
  // Fetch de página (paginación infinita)
  // --------------------------------------------
  const fetchPage = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    try {
      let q = supabase
        .from("booms_feed")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE + 1);

      if (cursor) q = q.lt("created_at", cursor);

      const { data, error } = await q;
      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }

      const rows = (data ?? []).map(mapRowToUI);
      const hasNext = rows.length > PAGE_SIZE;
      const slice = hasNext ? rows.slice(0, PAGE_SIZE) : rows;

      // Dedupe por id (por si el back repite registros limítrofes)
      const deduped = slice.filter((item) => {
        if (seenIds.current.has(item.id)) return false;
        seenIds.current.add(item.id);
        return true;
      });

      if (deduped.length === 0) {
        setHasMore(hasNext); // puede que haya más, pero lo deduped dio vacío
        setIsFetching(false);
        return;
      }

      // Fetch per-user like/save state for these booms
      const auth = await requireAuth();
      if (auth) {
        const boomIds = deduped.map((b) => b.id);
        const { liked, saved } = await fetchUserInteractions(boomIds, auth.userId);
        // If first page, reset; else, merge
        if (order.length === 0) {
          setBooms(deduped);
          useBoomStore.setState({ liked, saved });
        } else {
          addBooms(deduped);
          // Merge new likes/saves into store
          useBoomStore.setState((state) => {
            const newLiked = new Map(state.liked);
            const newSaved = new Map(state.saved);
            boomIds.forEach((id) => {
              newLiked.set(id, liked.get(id) ?? "off");
              newSaved.set(id, saved.get(id) ?? "off");
            });
            return { liked: newLiked, saved: newSaved };
          });
        }
      } else {
        // Not logged in: just set booms
        if (order.length === 0) setBooms(deduped);
        else addBooms(deduped);
      }

      setCursor(deduped[deduped.length - 1].created_at);
      setHasMore(hasNext);
    } finally {
      setIsFetching(false);
    }
  }, [cursor, hasMore, isFetching, booms.length, setBooms, addBooms, setCursor, setHasMore, setIsFetching, order.length]);

  // Primera carga + responsive
  useEffect(() => {
    fetchPage();
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------
  // Observer por tarjeta (visibilidad + registrar view)
  // --------------------------------------------
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current = cardRefs.current.slice(0, booms.length);

    order.forEach((id, idx) => {
      const boom = booms[id];
      const el = cardRefs.current[idx];
      if (!el) return;

      const observer = new window.IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting && entry.intersectionRatio >= OBS_THRESHOLD) {
            // Cambiar visible
            if (visibleIndex !== idx) setVisibleIndex(idx);

            // Contar view (una vez por boom)
            if (!viewed.current.has(boom.id)) {
              viewed.current.add(boom.id);
              (async () => {
                const auth = await requireAuth(); // sólo inserta si hay user
                if (!auth) return;
                await supabase.from("boom_views").insert({
                  boom_id: boom.id,
                  user_id: auth.userId,
                  session_id: sessionId,
                });
              })();
            }
          }
        },
        { threshold: [OBS_THRESHOLD] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs, i) => {
        const el = cardRefs.current[i];
        if (el) obs.unobserve(el);
        obs.disconnect();
      });
    };
  }, [order, booms, setVisibleIndex, visibleIndex, sessionId]);

  // Sentinela de paginación
  useEffect(() => {
    if (!loadRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) fetchPage();
      },
      { rootMargin: "200px" }
    );
    io.observe(loadRef.current);
    return () => io.disconnect();
  }, [fetchPage, loadRef.current]);

  // --------------------------------------------
  // Gestos: doble tap → like + animación 🔥
  // --------------------------------------------
  const onCardPointerDown = (e: React.PointerEvent, idx: number) => {
    const now = Date.now();

    // Al primer tap/click, activa el sonido global
    if (!soundEnabled) enableGlobalSound();

    if (now - lastTap.current < DOUBLE_TAP_MS) {
      // Like por id real, no por idx
      const boomId = order[idx];
      handleLike(boomId);
      const rect = (cardRefs.current[idx] as HTMLDivElement)?.getBoundingClientRect();
      const x = e.clientX - (rect?.left ?? 0);
      const y = e.clientY - (rect?.top ?? 0);
      const id = now + Math.floor(Math.random() * 1000);
      setFlames((prev) => [...prev, { id, x, y }]);
      setTimeout(() => setFlames((prev) => prev.filter((f) => f.id !== id)), 700);
    }

    lastTap.current = now;
  };

  // ============================================
  //                   RENDER
  // ============================================
  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#000" }}>
      {/* Header */}
      <header
        style={{
          position: "absolute",
          top: "env(safe-area-inset-top, 0px)",
          left: 0,
          right: 0,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          color: "#fff",
          fontWeight: 700,
          textShadow: "0 2px 6px rgba(0,0,0,.45)",
          pointerEvents: "none",
        }}
      >
        Booms
      </header>

      {/* Feed */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
          background: "#000",
        }}
      >
        {order.map((id, idx) => {
          const boom = booms[id];
          const shouldRender = idx >= start && idx <= end;
          // LOGS para depuración
          console.log(`Boom idx: ${idx}, id: ${boom.id}, video:`, boom.video, 'shouldLoad:', shouldRender);

          return (
            <div
              key={boom.id}
              ref={el => { cardRefs.current[idx] = el; }}
              onPointerDown={(e) => onCardPointerDown(e, idx)}
              style={{
                width: "100vw",
                height: "100vh",
                scrollSnapAlign: "start",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
                position: "relative",
              }}
            >
              <VideoFullScreen
                ref={el => { videoRefs.current[idx] = el; }}
                src={boom.video}
                poster={boom.cover}
                isActive={visibleIndex === idx}
                soundEnabled={soundEnabled}
                shouldLoad={shouldRender}
              />

              {/* Animación 🔥 */}
              {flames.map((f) => (
                <div
                  key={f.id}
                  style={{
                    position: "absolute",
                    left: f.x,
                    top: f.y,
                    transform: "translate(-50%, -50%)",
                    fontSize: 64,
                    pointerEvents: "none",
                    animation: "pop 700ms ease-out forwards",
                  }}
                >
                  🔥
                </div>
              ))}

              {/* Acciones (like/save/share/comment) */}
              <VideoActions
                boom={boom}
                index={idx}
                isLiked={liked.get(boom.id) === "on"}
                isSaved={saved.get(boom.id) === "on"}
                isMobile={isMobile}
                onLike={() => handleLike(boom.id)}
                onSave={() => handleSave(boom.id)}
                onShare={() => handleShare(boom.id)}
                onComment={() => setCommentModal({ open: true, boomId: boom.id })}
                commentsCount={boom.comments ?? 0}
              />
      {/* Modal de comentarios */}
      <CommentModal
        open={commentModal.open}
        onClose={() => setCommentModal({ open: false, boomId: null })}
        comments={comments}
        commentCount={commentCount}
        onSend={async (text) => {
          if (!commentModal.boomId) return;
          const auth = await requireAuth();
          if (!auth) {
            alert("Debes iniciar sesión para comentar");
            return;
          }
          await supabase.from("boom_comments").insert({
            boom_id: commentModal.boomId,
            user_id: auth.userId,
            content: text,
          });
          const { data } = await supabase
            .from("boom_comments")
            .select("id, user_id, content, created_at")
            .eq("boom_id", commentModal.boomId)
            .order("created_at", { ascending: false });
          if (data) {
            setComments(data.map((c: any) => ({
              id: c.id,
              avatar: "/avatar.jpg",
              text: c.content,
              fireCount: 0,
              xCount: 0,
            })));
            setCommentCount(data.length);
          }
        }}
        onReact={(commentId, type) => {
          setComments((prev) => prev.map((c) =>
            c.id === commentId
              ? { ...c, fireCount: type === "fire" ? c.fireCount + 1 : c.fireCount, xCount: type === "x" ? c.xCount + 1 : c.xCount }
              : c
          ));
        }}
        onGift={() => {
          alert("¡Envío de regalo!");
        }}
        isMobile={isMobile}
        videoRef={videoRefs.current[visibleIndex] ? { current: videoRefs.current[visibleIndex] } : undefined}
      />

              {/* Info */}
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  bottom: `calc(${NAV_H_PX}px + env(safe-area-inset-bottom, 0px) + 16px)`,
                  color: "#fff",
                  zIndex: 10,
                  textShadow: "0 2px 8px #000a",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 18 }}>{boom.title}</div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>
                  {boom.user} · 👁️ {boom.views ?? 0}
                </div>
              </div>
            </div>
          );
        })}

        {/* Sentinela de paginación */}
        <div ref={loadRef} style={{ height: 12 }} />

  {!hasMore && order.length > 0 && (
          <div style={{ color: "#aaa", textAlign: "center", padding: 16 }}>
            No hay más booms
          </div>
        )}
      </div>

      {/* Animaciones globales */}
      <style jsx global>{`
        @keyframes pop {
          0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
          30% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
        body {
          overflow: ${commentModal.open ? 'hidden' : 'auto'};
        }
      `}</style>

      {/* Menú de navegación inferior (oculto si modal abierto) */}
      {!commentModal.open && <BottomDock />}
    </div>
  );
}
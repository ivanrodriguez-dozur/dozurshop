"use client";

/**
 * /welcome/page.tsx  —  Onboarding de Boom (versión pro y configurable)
 * ---------------------------------------------------------------------------------
 * ✅ Lee slides desde Supabase (tabla: public.welcome_slides) con RLS (is_active=true)
 * ✅ Aro “Boom” con neón girando, texto por encima, y botón Omitir con fondo glass
 * ✅ Posición del aro, brillo y color totalmente configurables (UI_CONFIG)
 * ✅ Imágenes con object-position ajustable para centrar miradas
 * ✅ Scroll-snap horizontal, dots y CTAs editables
 *
 * DÓNDE EDITAR RÁPIDO:
 *  - UI_CONFIG: colores, tamaños, posiciones, textos por defecto, offsets, etc.
 *  - ROUTES: a dónde navega “Omitir” o CTAs (si los activas)
 *  - IMPORT de supabase: ajusta el path si tu cliente está en otra ruta
 *
 * REQUISITOS:
 *  - Tabla `public.welcome_slides`: id, order, title, subtitle, image_url, is_active
 *  - Storage bucket `welcome` con imágenes públicas
 *  - next.config.js: agregar "<TU-PROYECTO>.supabase.co" en images.domains
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ⚠️ Ajusta esta ruta si tu cliente está en otro lugar:
import { supabase } from "@/lib/supabaseClient";


/* ===================== CONFIG GLOBAL (edita aquí) ===================== */
const UI_CONFIG = {
  // Marca y neón (elige uno u otro o pon tu HEX)
  neonColor: "#32E6FF", // 💡 Azul neon (#FF3BF5 → fucsia, #32E676 → verde)
  // Texto con brillo neon (afecta Boom y Omitir)
  neonTextGlow: true,

  // Aro Boom
  ring: {
    diameter: 120,     // tamaño del contenedor del aro (px)
    innerDisk: 96,     // diámetro del disco negro central (px)
    thickness: 4,      // grosor del anillo (px)
    speedSec: 1.6,     // velocidad de giro (s)
    showDot: true,     // punto brillante que recorre el aro
  },

  // Posicionamiento del aro/encabezado (respecto al top)
  header: {
    topOffset: 400,   // px desde la parte superior (útil para que no se corte)
    center: true,    // centrado horizontal
  },

  // Botón “Omitir”
  omit: {
    text: "Omitir",
    hasGlass: true,   // fondo tipo glass negro translúcido
  },

  // Imágenes: enfoque vertical (object-position Y) — 0% = arriba, 50% = centro
  imageFocusYPercent: 30, // sube/baja el foco para centrar la mirada del jugador

  // Overlay de lectura sobre las imágenes
  overlays: {
    gradientTop: "rgba(0,0,0,0.18)",
    gradientBottom: "rgba(0,0,0,0.92)",
  },

  // Tipos de letra / pesos
  font: {
    titleSize: 28,
    subtitleSize: 15,
  },
};

const ROUTES = {
  afterSkip: "/booms", // adónde va "Omitir"
  // Si luego activas CTAs: login Google / email / invitado
  loginGoogle: "/auth/login?provider=google",
  loginEmail: "/auth/login",
  guest: "/booms",
};
/* ===================================================================== */

type SlideRow = {
  id: string;
  order: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  is_active: boolean;
};

export default function WelcomePage() {
  const [slides, setSlides] = useState<SlideRow[] | null>(null);
  const [active, setActive] = useState(0);
  const slidesRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cargar slides activos ordenados
  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data, error } = await supabase
        .from("welcome_slides")
        .select("*")
        .eq("is_active", true)
        .order("order", { ascending: true });
      if (cancel) return;
      if (error) {
        console.warn("welcome_slides error:", error.message);
        setSlides([]);
      } else {
        setSlides(data ?? []);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // Detectar slide activo con IntersectionObserver
  useEffect(() => {
    const nodes = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (entry?.isIntersecting) {
          const idx = nodes.findIndex((n) => n === entry.target);
          if (idx >= 0) setActive(idx);
        }
      },
      { threshold: [0.4, 0.6, 0.8] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [slides]);

  // Navegar por dots
  const scrollTo = (idx: number) =>
    slideRefs.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "start" });

  // Helpers de estilo
  const neon = UI_CONFIG.neonColor;
  const textGlow = UI_CONFIG.neonTextGlow
    ? `0 0 6px ${neon}, 0 0 14px ${neon}`
    : "0 2px 10px rgba(0,0,0,.7)";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0A0A0B",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ===== Header (Aro Boom + Omitir) — flotante y más abajo ===== */}
      <div
        style={{
          position: "absolute",
          top: `calc(env(safe-area-inset-top, 0px) + ${UI_CONFIG.header.topOffset}px)`,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: UI_CONFIG.header.center ? "center" : "flex-start",
          gap: 12,
          zIndex: 30,
          pointerEvents: "none", // los hijos activan pointerEvents donde sea necesario
        }}
      >
        {/* Contenedor del aro */}
        <div
          style={{
            position: "relative",
            width: UI_CONFIG.ring.diameter,
            height: UI_CONFIG.ring.diameter,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Boom"
        >
          {/* Disco negro fijo */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: UI_CONFIG.ring.innerDisk,
              height: UI_CONFIG.ring.innerDisk,
              borderRadius: 999,
              background: "#000",
              zIndex: 0,
              boxShadow: "0 0 20px rgba(0,0,0,.7) inset",
            }}
          />
          {/* Aro girando (conic-gradient + máscara) */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              background: `conic-gradient(from 0deg, rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 240deg, ${hexToRgba(
                neon,
                0.95
              )} 300deg, rgba(0,0,0,0) 330deg, rgba(0,0,0,0) 360deg)`,
              WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${UI_CONFIG.ring.thickness}px), #000 0)`,
              mask: `radial-gradient(farthest-side, transparent calc(100% - ${UI_CONFIG.ring.thickness}px), #000 0)`,
              boxShadow: `0 0 14px ${hexToRgba(neon, 0.75)}`,
              animation: `spin ${UI_CONFIG.ring.speedSec}s linear infinite`,
              zIndex: 1,
            }}
          />
          {/* Punto brillante (opcional) */}
          {UI_CONFIG.ring.showDot && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 6,
                height: 6,
                borderRadius: 999,
                background: neon,
                boxShadow: `0 0 10px ${neon}, 0 0 20px ${neon}`,
                transformOrigin: `center -${
                  UI_CONFIG.ring.diameter / 2 - UI_CONFIG.ring.thickness - 6
                }px`,
                animation: `spin ${UI_CONFIG.ring.speedSec}s linear infinite`,
                zIndex: 1,
              }}
            />
          )}
          {/* Texto Boom arriba del todo */}
          <div
            style={{
              position: "relative",
              zIndex: 5,
              color: "#fff",
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: 0.2,
              textShadow: textGlow,
              pointerEvents: "auto",
            }}
          >
            Boom
          </div>
        </div>

        {/* Botón Omitir */}
        <button
          onClick={() => (window.location.href = ROUTES.afterSkip)}
          style={{
            position: "absolute",
            right: 16,
            top: -8, // alinea respecto al aro
            background: UI_CONFIG.omit.hasGlass ? "rgba(0,0,0,.6)" : "transparent",
            backdropFilter: UI_CONFIG.omit.hasGlass ? "blur(4px)" : undefined,
            WebkitBackdropFilter: UI_CONFIG.omit.hasGlass ? "blur(4px)" : undefined,
            border: `1px solid ${hexToRgba("#FFFFFF", 0.2)}`,
            color: "#fff",
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: `0 0 10px ${hexToRgba(neon, 0.55)}`,
            textShadow: textGlow,
            pointerEvents: "auto",
          }}
          aria-label={UI_CONFIG.omit.text}
        >
          {UI_CONFIG.omit.text}
        </button>
      </div>

      {/* ===== Carrusel de slides ===== */}
      <div
        ref={slidesRef}
        style={{
          position: "absolute",
          inset: 0,
          // sin paddingTop; el header flota y no empuja el layout
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {(slides ?? []).map((it, idx) => (
          <section
            key={it.id}
            ref={(el) => (slideRefs.current[idx] = el)}
            style={{
              flex: "0 0 100%",
              width: "100%",
              height: "100%",
              position: "relative",
              scrollSnapAlign: "start",
              padding: "24px 20px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 12,
              overflow: "hidden",
            }}
          >
            {/* Fondo con imagen */}
            {it.image_url ? (
              <Image
                src={it.image_url}
                alt={it.title}
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: `50% ${UI_CONFIG.imageFocusYPercent}%`,
                  zIndex: 0,
                }}
                priority={idx === 0}
              />
            ) : (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(60% 40% at 50% 25%, ${hexToRgba(
                    neon,
                    0.2
                  )}, rgba(0,0,0,0) 60%)`,
                  zIndex: 0,
                }}
              />
            )}

            {/* Overlay para lectura */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, ${UI_CONFIG.overlays.gradientTop} 40%, ${UI_CONFIG.overlays.gradientBottom} 85%)`,
                zIndex: 1,
              }}
            />

            {/* Texto */}
            <div style={{ zIndex: 2 }}>
              <h1
                style={{
                  fontSize: UI_CONFIG.font.titleSize,
                  lineHeight: 1.2,
                  margin: 0,
                  fontWeight: 900,
                  textShadow: "0 2px 10px rgba(0,0,0,.65)",
                }}
              >
                {it.title}
              </h1>
              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontSize: UI_CONFIG.font.subtitleSize,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,.78)",
                  textShadow: "0 2px 10px rgba(0,0,0,.55)",
                }}
              >
                {it.subtitle}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "env(safe-area-inset-bottom, 16px)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 12,
        }}
      >
        {(slides ?? []).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            style={{
              width: i === active ? 22 : 8,
              height: 8,
              borderRadius: 999,
              background: i === active ? neon : "rgba(255,255,255,.28)",
              border: "none",
              transition: "all .25s ease",
              cursor: "pointer",
              boxShadow: i === active ? `0 0 12px ${hexToRgba(neon, 0.6)}` : "none",
            }}
          />
        ))}
      </div>

      {/* Animación global del aro */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ===================== util ===================== */
function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
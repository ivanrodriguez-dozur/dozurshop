"use client";
import React from "react";
import { RING_COLORS } from "./constants";
import { FaCrown } from "react-icons/fa";

type Props = {
  avatarUrl: string;
  displayName: string;
  subtitle?: string;
  isChampion?: boolean; // pásalo desde PerfilUsuario si el user es campeón
  level?: number;
};

// VISUAL TUNING — EDITA VELOCIDAD/EFECTOS
const RING_SPEED_SECONDS = 7; // vuelta completa
const PULSE_INTERVAL = 10;    // pulso suave

export default function AvatarHero({ avatarUrl, displayName, subtitle, isChampion, level = 1 }: Props) {
  const ringStyle = getRingStyleByLevel(level);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 112, height: 112, margin: "0 auto 10px auto" }}>
        {/* ARO */}
        <div style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          background: ringStyle.background as any,
          filter: "blur(2px)",
          WebkitMask: "radial-gradient(circle at center, transparent 54%, #000 55%)",
          mask: "radial-gradient(circle at center, transparent 54%, #000 55%)",
          animation: `spin ${RING_SPEED_SECONDS}s linear infinite, pulse ${PULSE_INTERVAL}s ease-in-out infinite`,
        }} />
        {/* AVATAR */}
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "2px solid #222" }}>
          <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* CORONA 👑 */}
        {isChampion && (
          <div style={{ position: "absolute", top: -8, right: -8, background: "#111", border: "1px solid #333", borderRadius: 999, padding: 6 }}>
            <FaCrown color="#FFD700" size={16} />
          </div>
        )}
      </div>

      <div style={{ fontSize: 20, fontWeight: 900 }}>{displayName}</div>
      {subtitle && <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{subtitle}</div>}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: .9; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function getRingStyleByLevel(level: number) {
  if (level >= 10) return { background: RING_COLORS.legend };
  if (level >= 5) return { background: RING_COLORS.mid };
  return { background: RING_COLORS.base };
}
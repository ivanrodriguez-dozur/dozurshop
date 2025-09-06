"use client";
import React from "react";
import { FaBullseye } from "react-icons/fa";

// Conecta con tus tablas cuando estén listas
export default function ChallengesCard() {
  return (
    <div style={card}>
      <div style={header}><FaBullseye /> <span style={{ fontWeight: 800 }}>Retos</span></div>
      <div style={grid}>
        <Reto label="DIARIO" title="Mira 5 booms hoy" reward="+10 coins" progress="2/5" />
        <Reto label="SEMANAL" title="Da 5 🔥 esta semana" reward="+20 pts" progress="1/5" />
      </div>
    </div>
  );
}
function Reto({ label, title, reward, progress }: { label: string; title: string; reward: string; progress: string }) {
  return (
    <div style={retoCard}>
      <div style={{ fontSize: 10, opacity: .8, marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 12, opacity: .85, margin: "4px 0" }}>Recompensa: {reward}</div>
      <div style={{ fontSize: 12 }}>Progreso: {progress}</div>
    </div>
  );
}
const card: React.CSSProperties = { border: "1px solid #171717", borderRadius: 12, padding: 14, background: "linear-gradient(180deg,#0a0a0a,#070707)" };
const header: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
const retoCard: React.CSSProperties = { border: "1px solid #191919", borderRadius: 10, padding: 10, background: "#0e0e0e" };
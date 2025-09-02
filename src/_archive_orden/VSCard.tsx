"use client";
import React from "react";
import { FaStopwatch } from "react-icons/fa";

export default function VSCard() {
  const openVS = () => alert("Aquí se abrirá el Modal VS (enfrentamiento/torneo en vivo).");
  return (
    <div style={card} onClick={openVS}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 800 }}>VS del día</div>
        <span style={badge}><FaStopwatch /> 24h</span>
      </div>
      <div style={{ fontSize: 12, opacity: .85, marginTop: 4 }}>Vota y gana +coins · resultados en vivo</div>
      <button style={btn}>Abrir</button>
    </div>
  );
}
const card: React.CSSProperties = { cursor: "pointer", border: "1px solid #171717", borderRadius: 12, padding: 14, background: "linear-gradient(180deg,#0a0a0a,#070707)" };
const badge: React.CSSProperties = { fontSize: 12, background: "#111", border: "1px solid #222", padding: "4px 8px", borderRadius: 999, display: "inline-flex", gap: 6, alignItems: "center" };
const btn: React.CSSProperties = { marginTop: 10, background: "#13ef95", border: "none", color: "#000", borderRadius: 8, padding: "8px 10px", fontWeight: 800 };
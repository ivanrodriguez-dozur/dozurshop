"use client";
import React from "react";
import { FaTrophy } from "react-icons/fa";

export default function TournamentsCard() {
  const openTournament = () => alert("Aquí se abrirá el Modal Torneo (bracket en vivo).");
  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <FaTrophy /> <span style={{ fontWeight: 800 }}>Torneos</span>
      </div>
      <div style={{ fontSize: 12, opacity: .85 }}>Próxima copa: Golden League · Inicia en 3 días</div>
      <button style={btn} onClick={openTournament}>Ver Torneo</button>
    </div>
  );
}
const card: React.CSSProperties = { border: "1px solid #171717", borderRadius: 12, padding: 14, background: "linear-gradient(180deg,#0a0a0a,#070707)" };
const btn: React.CSSProperties = { marginTop: 10, background: "#13ef95", border: "none", color: "#000", borderRadius: 8, padding: "8px 10px", fontWeight: 800, cursor: "pointer" };
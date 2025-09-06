"use client";
import React from "react";
import { pretty } from "./format";
import { FaCoins, FaBolt, FaMedal, FaLock } from "react-icons/fa";

type Props = {
  coins: number;
  coinsVisible: boolean; // controla privacidad
  onGoToShop: () => void;
  points: number;
  level: number;
  levelProgress: number; // 0..1
  remainingText: string; // "Faltan X pts ..."
};

export default function PowerRow({ coins, coinsVisible, onGoToShop, points, level, levelProgress, remainingText }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
      {/* COINS */}
      <div style={cardStyle}>
        <div style={titleRow}><FaCoins /> <span style={{ fontWeight: 800 }}>Coins</span> {!coinsVisible && <FaLock title="Privados" style={{ marginLeft: 6, opacity: .8 }} />}</div>
        <div style={{ fontSize: 26, fontWeight: 900 }}>{coinsVisible ? pretty(coins) : "•••"}</div>
        <div style={{ fontSize: 12, opacity: .85, marginTop: 6 }}>Tus coins se usan para comprar productos dentro de Boom.</div>
        <button onClick={onGoToShop} style={primaryBtn}>Canjear</button>
      </div>

      {/* PUNTOS */}
      <div style={cardStyle}>
        <div style={titleRow}><FaBolt /> <span style={{ fontWeight: 800 }}>Puntos</span></div>
        <div style={{ fontSize: 26, fontWeight: 900 }}>{pretty(points)} pts</div>
        <div style={{ fontSize: 12, opacity: .85, marginTop: 6 }}>Suma puntos mirando booms, dando 🔥, completando retos y VS.</div>
      </div>

      {/* NIVEL */}
      <div style={cardStyle}>
        <div style={titleRow}><FaMedal /> <span style={{ fontWeight: 800 }}>Nivel</span></div>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Lv. {level}</div>
        <div style={{ height: 12, borderRadius: 999, overflow: "hidden", background: "#151515", border: "1px solid #1b1b1b" }}>
          <div style={{ width: `${Math.round(levelProgress * 100)}%`, height: "100%", background: "linear-gradient(90deg,#13ef95,#08a35b)", transition: "width .6s ease" }} />
        </div>
        <div style={{ fontSize: 12, opacity: .85, marginTop: 6 }}>{remainingText}</div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #171717", borderRadius: 12, padding: 14,
  background: "linear-gradient(180deg,#0a0a0a,#070707)", display: "flex", flexDirection: "column", gap: 6,
};
const titleRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, opacity: .95 };
const primaryBtn: React.CSSProperties = { marginTop: 8, background: "#13ef95", color: "#000", border: "none", borderRadius: 8, padding: "8px 10px", fontWeight: 800, cursor: "pointer" };
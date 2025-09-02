// === ECONOMÍA Y PREFERENCIAS GLOBALES — EDITA AQUÍ ===
export const POINTS_PER_COIN = 100;                 // cuántos puntos = 1 coin
export const LEVEL_UP_BONUS_COINS = 10;             // coins por subir nivel
export const DEFAULT_COINS_PRIVACY: "private" | "public" = "private";

// Requisitos de XP por nivel (puedes cambiar por fórmula)
export function xpRequiredForLevel(level: number): number {
  if (level < 5) return 50;        // Lv 1–4
  if (level < 10) return 100;      // Lv 5–9
  return 200;                      // Lv 10+
}

// Colores del aro por nivel (Avatar)
export const RING_COLORS = {
  base: "#13EF95",
  mid: "linear-gradient(90deg,#13EF95,#00D1FF)",
  legend: "linear-gradient(90deg,#13EF95,#FFD700)",
};

// A dónde manda el botón "Canjear"
export const SHOP_ROUTE = "/"; // cambia a "/home" o tu ruta de tienda
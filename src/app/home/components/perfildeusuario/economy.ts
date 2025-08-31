import { LEVEL_UP_BONUS_COINS, POINTS_PER_COIN, xpRequiredForLevel } from "./constants";

export function coinsFromPoints(points: number): number {
  return Math.floor(points / POINTS_PER_COIN);
}

export function levelProgress(currentLevel: number, currentXP: number): number {
  const need = xpRequiredForLevel(currentLevel);
  if (need <= 0) return 0;
  return Math.max(0, Math.min(1, currentXP / need));
}

export function remainingXPText(currentLevel: number, currentXP: number): string {
  const need = xpRequiredForLevel(currentLevel);
  const remain = Math.max(0, need - currentXP);
  return `Faltan ${remain} pts para Lv. ${currentLevel + 1}`;
}

export function levelUpBonusCoins(_: number): number {
  return LEVEL_UP_BONUS_COINS;
}
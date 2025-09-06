export const pretty = (n: number | string) => new Intl.NumberFormat().format(Number(n ?? 0));
export const shortDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString(); } catch { return ""; }
};
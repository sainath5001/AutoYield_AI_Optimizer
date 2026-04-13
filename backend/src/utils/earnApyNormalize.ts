/**
 * Normalize Earn APY fields to a display percentage.
 * Same rules as LI.FI NormalizedVault (mixed upstream units).
 */
export function normalizeEarnApyToPercent(
  raw: number | null | undefined,
): number {
  if (raw == null || Number.isNaN(raw) || raw < 0) return 0;
  if (raw <= 1) return raw * 100;
  if (raw <= 100) return raw;
  return raw / 100;
}

import type {
  ApyTrendRange,
  VaultApyProfileDto,
} from "@shared/vaultApyTrend";

export type ApyChartPoint = { label: string; apy: number };

/**
 * LI.FI Earn does not expose daily APY history. It exposes rolling averages:
 * apy1d, apy7d, apy30d plus current apy.total (see NormalizedVault schema).
 * We chart those real values as a horizon comparison (not intraday candles).
 */
export function buildApyChartPoints(
  p: VaultApyProfileDto,
  range: ApyTrendRange,
): ApyChartPoint[] {
  const cur = p.currentApyPercent;
  const d1 = p.apy1dPercent;
  const d7 = p.apy7dPercent;
  const d30 = p.apy30dPercent;

  switch (range) {
    case "today": {
      const pts: ApyChartPoint[] = [];
      if (d1 != null) pts.push({ label: "1d rolling avg", apy: d1 });
      pts.push({ label: "Current", apy: cur });
      return pts;
    }
    case "7d": {
      const pts: ApyChartPoint[] = [];
      if (d30 != null) pts.push({ label: "30d rolling avg", apy: d30 });
      if (d7 != null) pts.push({ label: "7d rolling avg", apy: d7 });
      if (d1 != null) pts.push({ label: "1d rolling avg", apy: d1 });
      pts.push({ label: "Current", apy: cur });
      return dedupeSequential(pts);
    }
    case "30d": {
      const pts: ApyChartPoint[] = [];
      if (d30 != null) pts.push({ label: "30d rolling avg", apy: d30 });
      if (d7 != null) pts.push({ label: "7d rolling avg", apy: d7 });
      if (d1 != null) pts.push({ label: "1d rolling avg", apy: d1 });
      pts.push({ label: "Current", apy: cur });
      return dedupeSequential(pts);
    }
    default:
      return [{ label: "Current", apy: cur }];
  }
}

/** Remove consecutive duplicate APY values (same y) to avoid flat double nodes. */
function dedupeSequential(pts: ApyChartPoint[]): ApyChartPoint[] {
  const out: ApyChartPoint[] = [];
  for (const pt of pts) {
    const prev = out[out.length - 1];
    if (prev && Math.abs(prev.apy - pt.apy) < 1e-6) continue;
    out.push(pt);
  }
  return out;
}

export function apyTrendInsight(p: VaultApyProfileDto): {
  message: string;
  variant: "up" | "down" | "stable";
} {
  const cur = p.currentApyPercent;
  const ref = p.apy7dPercent ?? p.apy30dPercent ?? p.apy1dPercent;
  if (ref == null) {
    return {
      message: "➡️ Not enough horizon data — showing current APY only.",
      variant: "stable",
    };
  }
  const diff = cur - ref;
  const eps = 0.05;
  if (diff > eps) {
    return {
      message:
        "📈 Current APY is above the selected rolling average — short-term momentum positive.",
      variant: "up",
    };
  }
  if (diff < -eps) {
    return {
      message:
        "📉 Current APY is below the rolling average — consider reviewing position.",
      variant: "down",
    };
  }
  return {
    message: "➡️ APY is in line with rolling averages — relatively stable.",
    variant: "stable",
  };
}

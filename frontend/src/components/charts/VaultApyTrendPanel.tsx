"use client";

import type { ApyTrendRange, VaultApyProfileDto } from "@shared/vaultApyTrend";
import * as React from "react";
import {
  apyTrendInsight,
  buildApyChartPoints,
} from "@/lib/vaultApyTrend";
import { fetchVaultApyProfile } from "@/services/vaultDetailApi";
import { APYChart } from "./APYChart";

const RANGES: { id: ApyTrendRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
];

type Props = {
  chainId: number;
  vaultAddress: string;
  vaultLabel: string;
  /** When false, no Earn API request is made (use after user expands). */
  enabled?: boolean;
};

export function VaultApyTrendPanel({
  chainId,
  vaultAddress,
  vaultLabel,
  enabled = true,
}: Props) {
  const [range, setRange] = React.useState<ApyTrendRange>("7d");
  const [profile, setProfile] = React.useState<VaultApyProfileDto | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!enabled) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetchVaultApyProfile(chainId, vaultAddress)
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [chainId, vaultAddress, enabled]);

  const chartPoints = React.useMemo(() => {
    if (!profile) return [];
    return buildApyChartPoints(profile, range);
  }, [profile, range]);

  const insight = profile ? apyTrendInsight(profile) : null;

  const insightClass =
    insight?.variant === "up"
      ? "border-emerald-500/30 bg-emerald-950/25 text-emerald-100"
      : insight?.variant === "down"
        ? "border-amber-500/30 bg-amber-950/25 text-amber-100"
        : "border-sky-500/30 bg-sky-950/20 text-sky-100";

  return (
    <div className="mt-4 rounded-xl border border-zinc-700/80 bg-zinc-950/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            APY trend (LI.FI Earn)
          </p>
          <p className="text-sm text-zinc-300">{vaultLabel}</p>
        </div>
        {profile ? (
          <span className="font-mono text-lg font-semibold tabular-nums text-emerald-400">
            {profile.currentApyPercent.toFixed(2)}%
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRange(r.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              range === r.id
                ? "bg-emerald-600 text-white"
                : "border border-zinc-600 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-zinc-500">
          Loading APY profile from API…
        </p>
      ) : error ? (
        <p className="py-6 text-center text-sm text-red-400">{error}</p>
      ) : profile ? (
        <>
          <div className="mt-4">
            <APYChart data={chartPoints} selectedRange={range} />
          </div>
          {insight ? (
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-relaxed ${insightClass}`}
            >
              {insight.message}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

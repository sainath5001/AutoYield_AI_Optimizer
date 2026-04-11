"use client";

import type { Vault } from "@shared/vault";
import { RiskBadge } from "@/components/yield/RiskBadge";
import { Spinner } from "@/components/ui/Spinner";

type Props = {
  vault: Vault | null;
  reason: string | null;
  loading: boolean;
  error: string | null;
  source: "openai" | "fallback" | null;
  onRebalance: () => void;
};

export function AIRecommendationPanel({
  vault,
  reason,
  loading,
  error,
  source,
  onRebalance,
}: Props) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-zinc-900/50 p-6 shadow-xl ring-1 ring-cyan-500/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">AI recommendation</h2>
        <div className="flex flex-wrap items-center gap-2">
          {source ? (
            <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
              {source === "openai" ? "OpenAI" : "Heuristic"}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onRebalance}
            disabled={loading}
            className="rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-900/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating…" : "Rebalance"}
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-zinc-400">
        Picks a USDC vault using your preference. Rebalance re-runs the model.
      </p>

      {loading && !vault ? (
        <div className="mt-6">
          <Spinner label="Analyzing vaults with AI…" />
        </div>
      ) : null}

      {loading && vault ? (
        <p className="mt-4 flex items-center gap-2 text-xs text-cyan-400/90">
          <span
            className="inline-block h-3 w-3 animate-spin rounded-full border border-cyan-500/30 border-t-cyan-400"
            aria-hidden
          />
          Refreshing recommendation…
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {vault ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{vault.protocol}</p>
                <p className="text-sm text-zinc-400">{vault.chainName}</p>
              </div>
              <RiskBadge level={vault.riskLevel} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-cyan-400">
                {vault.apyPercent.toFixed(2)}%
              </span>
              <span className="text-sm text-zinc-500">APY</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {vault.tokenSymbol} ·{" "}
              {vault.isTransactional === false
                ? "Composer deposit may be unavailable"
                : "Eligible for Composer deposit flow"}
            </p>
          </div>
          {reason ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Why this vault
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {reason}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {!loading && !error && !vault ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-center text-sm text-zinc-500">
          Load vaults to get an AI suggestion.
        </p>
      ) : null}
    </section>
  );
}

"use client";

import type { Vault } from "@shared/vault";
import { RiskBadge } from "@/components/yield/RiskBadge";

type Props = {
  vault: Vault | null;
};

export function AIRecommendationPanel({ vault }: Props) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-zinc-900/50 p-6 shadow-xl ring-1 ring-cyan-500/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">AI recommendation</h2>
        <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
          Rules-based
        </span>
      </div>
      <p className="mt-1 text-sm text-zinc-400">
        Suggested USDC vault from LI.FI Earn data based on your preference.
      </p>
      {vault ? (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
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
              ? "Deposit may be unavailable via Composer"
              : "Ready for Composer deposit flow"}
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-center text-sm text-zinc-500">
          No vaults loaded yet. Connect the API or adjust filters.
        </p>
      )}
    </section>
  );
}

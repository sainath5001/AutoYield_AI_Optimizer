"use client";

import type { PortfolioPosition } from "@/contexts/PortfolioContext";

type Props = {
  position: PortfolioPosition | null;
};

export function PortfolioSection({ position }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-lg font-semibold text-white">Portfolio</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Demo position (stored in memory — no database).
      </p>
      {position ? (
        <div className="mt-6 grid gap-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Vault
            </p>
            <p className="mt-1 font-medium text-white">
              {position.vault.protocol}
            </p>
            <p className="text-sm text-zinc-400">{position.vault.chainName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Amount (demo)
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-emerald-400">
              {position.amountUsd} {position.vault.tokenSymbol}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              APY
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-white">
              {position.apyPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 px-4 py-10 text-center text-sm text-zinc-500">
          No simulated position yet. Use <strong>Invest</strong> on a vault to
          record a demo deposit after signing the intent transaction.
        </p>
      )}
    </section>
  );
}

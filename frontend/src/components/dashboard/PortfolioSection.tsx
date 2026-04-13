"use client";

import type { EarnPosition } from "@/services/portfolioApi";
import { Spinner } from "@/components/ui/Spinner";

type Props = {
  positions: EarnPosition[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function PortfolioSection({
  positions,
  loading,
  error,
  onRetry,
}: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-lg font-semibold text-white">Portfolio</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Positions from{" "}
        <span className="text-zinc-300">LI.FI Earn</span> (indexed DeFi
        positions for your wallet).
      </p>

      {loading ? (
        <div className="mt-6">
          <Spinner label="Loading Earn portfolio…" />
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-xs font-semibold text-rose-100 underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && positions.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 px-4 py-10 text-center text-sm text-zinc-500">
          No Earn-indexed positions for this wallet yet. After a successful
          vault deposit, data may take a short time to appear.
        </p>
      ) : null}

      {!loading && !error && positions.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {positions.map((p, i) => (
            <li
              key={`${p.chainId}-${p.protocolName}-${p.asset.address}-${i}`}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-white">
                  {p.protocolName}
                </span>
                <span className="text-xs text-zinc-500">
                  Chain {p.chainId}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">{p.asset.symbol}</p>
              <p className="mt-2 font-mono text-emerald-400">
                ≈ ${Number.parseFloat(p.balanceUsd || "0").toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                <span className="text-xs text-zinc-500">USD (Earn)</span>
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

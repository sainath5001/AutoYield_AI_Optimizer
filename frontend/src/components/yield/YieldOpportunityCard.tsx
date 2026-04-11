"use client";

import type { Vault } from "@shared/vault";
import { RiskBadge } from "./RiskBadge";

type Props = {
  vault: Vault;
  onInvest?: (vault: Vault) => void;
  busy?: boolean;
};

function canDeposit(vault: Vault): boolean {
  if (!vault.vaultAddress) return false;
  if (vault.isTransactional === false) return false;
  return true;
}

export function YieldOpportunityCard({ vault, onInvest, busy }: Props) {
  const allowed = canDeposit(vault);

  return (
    <article className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-xl transition hover:border-emerald-500/30 hover:bg-zinc-900/80">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{vault.protocol}</h3>
          <p className="mt-0.5 text-sm text-zinc-400">{vault.chainName}</p>
        </div>
        <RiskBadge level={vault.riskLevel} />
      </div>
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums text-emerald-400">
          {vault.apyPercent.toFixed(2)}%
        </span>
        <span className="text-sm text-zinc-500">APY</span>
      </div>
      <p className="mb-4 text-xs text-zinc-500">
        {vault.tokenSymbol} · Chain ID {vault.chainId}
      </p>
      <button
        type="button"
        disabled={!allowed || busy}
        onClick={() => onInvest?.(vault)}
        title={
          !vault.vaultAddress
            ? "Earn did not expose a vault contract address for Composer."
            : vault.isTransactional === false
              ? "Composer does not list this vault as depositable yet."
              : undefined
        }
        className="mt-auto w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:from-emerald-500 hover:to-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:from-emerald-600 disabled:hover:to-cyan-600"
      >
        {busy
          ? "Signing…"
          : !vault.vaultAddress
            ? "No on-chain vault"
            : vault.isTransactional === false
              ? "Unavailable"
              : "Invest"}
      </button>
    </article>
  );
}

"use client";

import type { Vault } from "@shared/vault";
import { YieldOpportunityCard } from "@/components/yield/YieldOpportunityCard";

type Props = {
  opportunities: Vault[];
  onInvest: (vault: Vault) => void | Promise<void>;
  investingVaultId: string | null;
};

export function TopYieldOpportunities({
  opportunities,
  onInvest,
  investingVaultId,
}: Props) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Top yield opportunities</h2>
        <p className="mt-1 text-sm text-zinc-400">
          USDC vaults on Ethereum & Arbitrum via LI.FI Earn — highest APY first.
        </p>
      </div>
      {opportunities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 px-4 py-12 text-center text-sm text-zinc-500">
          No USDC vaults returned for this network filter.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {opportunities.map((vault) => (
            <YieldOpportunityCard
              key={vault.id}
              vault={vault}
              busy={investingVaultId === vault.id}
              onInvest={onInvest}
            />
          ))}
        </div>
      )}
    </section>
  );
}

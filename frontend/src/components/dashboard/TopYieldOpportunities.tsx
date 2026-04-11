"use client";

import type { Vault } from "@shared/vault";
import { YieldOpportunityCard } from "@/components/yield/YieldOpportunityCard";

type Props = {
  opportunities: Vault[];
};

export function TopYieldOpportunities({ opportunities }: Props) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Top yield opportunities</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Mock vaults across Ethereum & Arbitrum — Earn API integration comes next.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {opportunities.map((vault) => (
          <YieldOpportunityCard
            key={vault.id}
            vault={vault}
            onInvest={() => {
              // Placeholder — execution wired with LI.FI later
            }}
          />
        ))}
      </div>
    </section>
  );
}

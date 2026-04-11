"use client";

import * as React from "react";
import { WalletInfo } from "@/components/dashboard/WalletInfo";
import { AIRecommendationPanel } from "@/components/dashboard/AIRecommendationPanel";
import { UserPreferenceSelector } from "@/components/dashboard/UserPreferenceSelector";
import { TopYieldOpportunities } from "@/components/dashboard/TopYieldOpportunities";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Spinner } from "@/components/ui/Spinner";
import { useUserPreference } from "@/hooks/useUserPreference";
import { useVaults } from "@/hooks/useVaults";
import { selectRecommendationForPreference } from "@/lib/selectRecommendation";

export default function DashboardPage() {
  const { preference, setPreference } = useUserPreference();
  const { vaults, loading, error, refetch } = useVaults();

  const recommendedVault = React.useMemo(
    () => selectRecommendationForPreference(preference, vaults),
    [preference, vaults],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Live vaults from LI.FI Earn (USDC, Ethereum & Arbitrum), sorted by APY.
        </p>
      </div>

      <WalletInfo />

      {loading ? (
        <Spinner label="Loading vaults from LI.FI Earn…" />
      ) : null}

      {error ? (
        <ErrorAlert
          title="Could not load vaults"
          message={error}
          onRetry={() => void refetch()}
        />
      ) : null}

      {!loading && !error ? (
        <>
          <TopYieldOpportunities opportunities={vaults} />
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <AIRecommendationPanel vault={recommendedVault} />
            <UserPreferenceSelector value={preference} onChange={setPreference} />
          </div>
        </>
      ) : null}
    </div>
  );
}

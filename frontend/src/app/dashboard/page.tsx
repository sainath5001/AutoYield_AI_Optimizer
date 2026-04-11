"use client";

import * as React from "react";
import { WalletInfo } from "@/components/dashboard/WalletInfo";
import { AIRecommendationPanel } from "@/components/dashboard/AIRecommendationPanel";
import { UserPreferenceSelector } from "@/components/dashboard/UserPreferenceSelector";
import { TopYieldOpportunities } from "@/components/dashboard/TopYieldOpportunities";
import { useUserPreference } from "@/hooks/useUserPreference";
import {
  MOCK_YIELD_OPPORTUNITIES,
  selectMockRecommendation,
} from "@/lib/mockVaults";

export default function DashboardPage() {
  const { preference, setPreference } = useUserPreference();

  const recommendedVault = React.useMemo(
    () => selectMockRecommendation(preference),
    [preference],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Explore mock yield data and preferences — backend & Earn API next.
        </p>
      </div>

      <WalletInfo />

      <TopYieldOpportunities opportunities={MOCK_YIELD_OPPORTUNITIES} />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <AIRecommendationPanel vault={recommendedVault} />
        <UserPreferenceSelector value={preference} onChange={setPreference} />
      </div>
    </div>
  );
}

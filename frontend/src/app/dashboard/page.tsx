"use client";

import * as React from "react";
import { toast } from "sonner";
import type { UserPreference } from "@shared/recommendation";
import type { Vault } from "@shared/vault";
import { WalletInfo } from "@/components/dashboard/WalletInfo";
import { AIRecommendationPanel } from "@/components/dashboard/AIRecommendationPanel";
import { UserPreferenceSelector } from "@/components/dashboard/UserPreferenceSelector";
import { TopYieldOpportunities } from "@/components/dashboard/TopYieldOpportunities";
import { PortfolioSection } from "@/components/dashboard/PortfolioSection";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Spinner } from "@/components/ui/Spinner";
import { PortfolioProvider, usePortfolio } from "@/contexts/PortfolioContext";
import { useUserPreference } from "@/hooks/useUserPreference";
import { useVaults } from "@/hooks/useVaults";
import { useAiRecommendation } from "@/hooks/useAiRecommendation";
import { useInvestMock } from "@/hooks/useInvestMock";

function DashboardInner() {
  const { preference, setPreference } = useUserPreference();
  const { vaults, loading: vaultsLoading, error: vaultsError, refetch } =
    useVaults();
  const { position, setPosition } = usePortfolio();
  const { invest } = useInvestMock();
  const [investingId, setInvestingId] = React.useState<string | null>(null);

  const canRecommend =
    !vaultsLoading && !vaultsError && vaults.length > 0;

  const {
    data: aiData,
    loading: aiLoading,
    error: aiError,
    refresh: refreshAi,
  } = useAiRecommendation(vaults, preference, canRecommend);

  const handlePreferenceChange = React.useCallback(
    (p: UserPreference) => {
      setPreference(p);
      toast.info(`Preference: ${p.replace(/_/g, " ")}`, { duration: 2000 });
    },
    [setPreference],
  );

  const handleInvest = React.useCallback(
    async (vault: Vault) => {
      setInvestingId(vault.id);
      const toastId = toast.loading("Open your wallet to sign the demo intent…");
      try {
        await invest(vault);
        toast.success("Demo deposit recorded in portfolio.", { id: toastId });
        setPosition({
          vault,
          amountUsd: "1,000.00",
          apyPercent: vault.apyPercent,
          investedAt: Date.now(),
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Transaction failed";
        const lower = msg.toLowerCase();
        if (
          lower.includes("reject") ||
          lower.includes("denied") ||
          lower.includes("user rejected")
        ) {
          toast.error("Transaction was rejected in the wallet.", {
            id: toastId,
          });
        } else {
          toast.error(msg, { id: toastId });
        }
      } finally {
        setInvestingId(null);
      }
    },
    [invest, setPosition],
  );

  const handleRebalance = React.useCallback(() => {
    void toast.promise(refreshAi(), {
      loading: "Re-running AI recommendation…",
      success: "Recommendation updated.",
      error: (err) =>
        err instanceof Error ? err.message : "Could not update recommendation.",
    });
  }, [refreshAi]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Live vaults from LI.FI Earn, AI pick from OpenAI (or heuristic), and a
          demo invest flow.
        </p>
      </div>

      <WalletInfo />

      <PortfolioSection position={position} />

      {vaultsLoading ? (
        <Spinner label="Loading vaults from LI.FI Earn…" />
      ) : null}

      {vaultsError ? (
        <ErrorAlert
          title="Could not load vaults"
          message={vaultsError}
          onRetry={() => void refetch()}
        />
      ) : null}

      {!vaultsLoading && !vaultsError ? (
        <>
          <TopYieldOpportunities
            opportunities={vaults}
            onInvest={handleInvest}
            investingVaultId={investingId}
          />
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <AIRecommendationPanel
              vault={aiData?.vault ?? null}
              reason={aiData?.reason ?? null}
              loading={aiLoading}
              error={aiError}
              source={aiData?.source ?? null}
              onRebalance={handleRebalance}
            />
            <UserPreferenceSelector
              value={preference}
              onChange={handlePreferenceChange}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PortfolioProvider>
      <DashboardInner />
    </PortfolioProvider>
  );
}

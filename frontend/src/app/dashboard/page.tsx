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
import { useUserPreference } from "@/hooks/useUserPreference";
import { useVaults } from "@/hooks/useVaults";
import { useAiRecommendation } from "@/hooks/useAiRecommendation";
import { useComposerDeposit } from "@/hooks/useComposerDeposit";
import { useEarnPortfolio } from "@/hooks/useEarnPortfolio";
import { DemoSimulation } from "@/components/demo/DemoSimulation";

// This page depends on wallet state (client-only) via wagmi/rainbowkit.
// Avoid static prerendering at build time to prevent provider-less rendering.
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { preference, setPreference } = useUserPreference();
  const { vaults, loading: vaultsLoading, error: vaultsError, refetch } =
    useVaults();
  const {
    positions,
    loading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = useEarnPortfolio();
  const { deposit } = useComposerDeposit();
  const [investingId, setInvestingId] = React.useState<string | null>(null);
  const [depositUsdc, setDepositUsdc] = React.useState("5");

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
      const toastId = toast.loading("Getting LI.FI Composer quote…");
      try {
        await deposit(vault, depositUsdc);
        toast.success("Transaction submitted.", { id: toastId });
        await refetchPortfolio();
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
    [deposit, depositUsdc, refetchPortfolio],
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
          LI.FI Earn vaults, OpenAI recommendation, Composer deposits, and Earn
          portfolio positions.
        </p>
      </div>

      <DemoSimulation />

      <WalletInfo />

      <PortfolioSection
        positions={positions}
        loading={portfolioLoading}
        error={portfolioError}
        onRetry={() => void refetchPortfolio()}
      />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5">
        <label
          htmlFor="deposit-usdc"
          className="text-sm font-medium text-zinc-300"
        >
          USDC amount per deposit
        </label>
        <p className="mt-0.5 text-xs text-zinc-500">
          Used for LI.FI Composer quotes (same-chain USDC → vault). You must
          have enough USDC + gas on the vault&apos;s chain.
        </p>
        <input
          id="deposit-usdc"
          type="text"
          inputMode="decimal"
          value={depositUsdc}
          onChange={(e) => setDepositUsdc(e.target.value)}
          className="mt-2 w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="e.g. 10"
        />
      </div>

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

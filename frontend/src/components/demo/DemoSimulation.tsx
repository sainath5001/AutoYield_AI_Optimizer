"use client";

import * as React from "react";
import { VaultApyTrendPanel } from "@/components/charts/VaultApyTrendPanel";

type DemoPhase = "idle" | "initial" | "opportunity" | "rebalancing" | "complete";

const MOCK_VAULT_A = {
  name: "Morpho · Vault A",
  apy: 5,
  chain: "Ethereum",
};

const MOCK_VAULT_B = {
  name: "Morpho · Vault B",
  apy: 7,
  chain: "Arbitrum",
};

const AMOUNT_USD = 1000;

/** Real vault contracts for side-by-side LI.FI APY comparison (not simulated). */
const DEMO_APY_ETH_USDC = {
  chainId: 1,
  address: "0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c",
  label: "Ethereum · Aave v3 USDC (illustrative “before”)",
};
const DEMO_APY_ARB_USDC = {
  chainId: 42161,
  address: "0x724dc807b04555b71ed48a6896b6f41593b8c637",
  label: "Arbitrum · Aave v3 USDC (illustrative “after”)",
};

export function DemoSimulation() {
  const [phase, setPhase] = React.useState<DemoPhase>("idle");
  const timeoutRefs = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = React.useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  React.useEffect(() => () => clearTimers(), [clearTimers]);

  const schedule = React.useCallback(
    (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        fn();
        timeoutRefs.current = timeoutRefs.current.filter((t) => t !== id);
      }, ms);
      timeoutRefs.current.push(id);
    },
    [],
  );

  const startDemo = React.useCallback(() => {
    clearTimers();
    setPhase("initial");
    // Step 2–3: after 2s — opportunity + better vault
    schedule(() => setPhase("opportunity"), 2000);
    // Step 4: rebalancing — short beat after opportunity UI, then spinner 2s
    schedule(() => setPhase("rebalancing"), 2000 + 1800);
    // Step 5–6: final + AI insight
    schedule(() => setPhase("complete"), 2000 + 1800 + 2000);
  }, [clearTimers, schedule]);

  const resetDemo = React.useCallback(() => {
    clearTimers();
    setPhase("idle");
  }, [clearTimers]);

  const isRunning = phase !== "idle";

  return (
    <section
      className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-lg ring-1 ring-zinc-800/80"
      aria-label="Demo simulation"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Demo mode</h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            Simulated flow — no wallet, no real transactions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isRunning ? (
            <button
              type="button"
              onClick={startDemo}
              className="rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Run Demo
            </button>
          ) : phase === "complete" ? (
            <button
              type="button"
              onClick={resetDemo}
              className="rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              Run again
            </button>
          ) : (
            <span className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-500">
              Running…
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Step 1 — initial mock position (hidden after flow completes) */}
        {isRunning && phase !== "complete" && (
          <div
            className={`rounded-xl border p-5 transition-all duration-500 ease-out ${
              phase === "initial"
                ? "border-blue-500/40 bg-blue-950/25 ring-1 ring-blue-500/20"
                : "border-zinc-700/80 bg-zinc-950/50"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
              Step 1 · Initial state
            </p>
            <div className="mt-3 grid gap-2 text-sm text-zinc-200 sm:grid-cols-2">
              <div>
                <span className="text-zinc-500">Token</span>
                <p className="font-mono font-medium text-white">USDC</p>
              </div>
              <div>
                <span className="text-zinc-500">Amount</span>
                <p className="font-mono font-medium text-emerald-400">
                  ${AMOUNT_USD.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-zinc-500">Current vault</span>
                <p className="font-medium text-white">{MOCK_VAULT_A.name}</p>
              </div>
              <div>
                <span className="text-zinc-500">APY</span>
                <p className="font-medium text-white">{MOCK_VAULT_A.apy}%</p>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-blue-500/10 px-3 py-2 text-center text-sm font-medium text-blue-200">
              Mock position created
            </p>
          </div>
        )}

        {/* Step 2 — opportunity alert */}
        {(phase === "opportunity" || phase === "rebalancing") && (
          <div
            className="rounded-xl border border-amber-500/35 bg-amber-950/30 p-4 ring-1 ring-amber-500/20 transition-opacity duration-500"
            role="status"
          >
            <p className="text-center text-base font-semibold text-amber-200">
              ⚡ New opportunity detected!
            </p>
          </div>
        )}

        {/* Live LI.FI APY horizon charts (same API as production) */}
        {(phase === "opportunity" ||
          phase === "rebalancing" ||
          phase === "complete") && (
          <div className="grid gap-4 md:grid-cols-2">
            <VaultApyTrendPanel
              chainId={DEMO_APY_ETH_USDC.chainId}
              vaultAddress={DEMO_APY_ETH_USDC.address}
              vaultLabel={DEMO_APY_ETH_USDC.label}
            />
            <VaultApyTrendPanel
              chainId={DEMO_APY_ARB_USDC.chainId}
              vaultAddress={DEMO_APY_ARB_USDC.address}
              vaultLabel={DEMO_APY_ARB_USDC.label}
            />
          </div>
        )}

        {/* Step 3 — better vault */}
        {(phase === "opportunity" || phase === "rebalancing") && (
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 ring-1 ring-cyan-500/15 transition-opacity duration-500">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
              Step 3 · Better yield
            </p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-zinc-500">Vault</span>
                <p className="font-medium text-white">{MOCK_VAULT_B.name}</p>
              </div>
              <div>
                <span className="text-zinc-500">APY</span>
                <p className="font-semibold text-emerald-400">
                  {MOCK_VAULT_B.apy}%
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-zinc-500">Chain</span>
                <p className="font-medium text-white">{MOCK_VAULT_B.chain}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-cyan-200/90">
              Better yield found by AI optimizer
            </p>
          </div>
        )}

        {/* Step 4 — rebalancing */}
        {phase === "rebalancing" && (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950/60 py-8"
            role="status"
            aria-live="polite"
          >
            <div
              className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500"
              aria-hidden
            />
            <p className="text-sm font-medium text-zinc-300">
              Rebalancing funds…
            </p>
          </div>
        )}

        {/* Step 5–6 — final + AI insight */}
        {phase === "complete" && (
          <div className="space-y-4 transition-opacity duration-500">
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-950/25 p-5 ring-1 ring-emerald-500/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                Step 5 · Final state
              </p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-zinc-500">Current vault</span>
                  <p className="font-medium text-white">{MOCK_VAULT_B.name}</p>
                </div>
                <div>
                  <span className="text-zinc-500">APY</span>
                  <p className="font-semibold text-emerald-400">
                    {MOCK_VAULT_B.apy}%
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-zinc-500">Chain</span>
                  <p className="font-medium text-white">{MOCK_VAULT_B.chain}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-emerald-200/95">
                Funds successfully moved to higher yield vault
              </p>
            </div>

            <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 ring-1 ring-sky-500/15">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
                Step 6 · AI insight
              </p>
              <p className="mt-2 text-sm leading-relaxed text-sky-100/95">
                AI recommendation: Switching increased expected yield by{" "}
                {MOCK_VAULT_B.apy - MOCK_VAULT_A.apy}%.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

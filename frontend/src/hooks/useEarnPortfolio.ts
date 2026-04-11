"use client";

import * as React from "react";
import { useAccount } from "wagmi";
import { fetchEarnPositions } from "@/services/portfolioApi";
import type { EarnPosition } from "@/services/portfolioApi";

export function useEarnPortfolio() {
  const { address, isConnected } = useAccount();
  const [positions, setPositions] = React.useState<EarnPosition[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!isConnected || !address) {
      setPositions([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEarnPositions(address);
      setPositions(data);
    } catch (e) {
      setPositions([]);
      setError(e instanceof Error ? e.message : "Could not load portfolio.");
    } finally {
      setLoading(false);
    }
  }, [isConnected, address]);

  React.useEffect(() => {
    void load();
  }, [load]);

  return { positions, loading, error, refetch: load };
}

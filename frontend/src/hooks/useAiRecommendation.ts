"use client";

import * as React from "react";
import type { AiRecommendationResponse } from "@shared/recommendation";
import type { UserPreference } from "@shared/recommendation";
import type { Vault } from "@shared/vault";
import { fetchAiRecommendation } from "@/services/recommendationApi";

export function useAiRecommendation(
  vaults: Vault[],
  preference: UserPreference,
  enabled: boolean,
) {
  const [data, setData] = React.useState<AiRecommendationResponse | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const requestIdRef = React.useRef(0);

  const refresh = React.useCallback(async () => {
    if (!enabled || vaults.length === 0) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const id = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAiRecommendation(vaults, preference);
      if (requestIdRef.current === id) {
        setData(result);
      }
    } catch (e) {
      if (requestIdRef.current === id) {
        setData(null);
        setError(e instanceof Error ? e.message : "Recommendation failed");
      }
    } finally {
      if (requestIdRef.current === id) {
        setLoading(false);
      }
    }
  }, [enabled, vaults, preference]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

"use client";

import * as React from "react";
import type { Vault } from "@shared/vault";
import { fetchVaults } from "@/services/vaultsApi";

export function useVaults() {
  const [vaults, setVaults] = React.useState<Vault[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVaults();
      setVaults(data);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to load vaults from the API.";
      setError(message);
      setVaults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  return { vaults, loading, error, refetch: load };
}

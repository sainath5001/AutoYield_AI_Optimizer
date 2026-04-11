import axios from "axios";
import type { Vault } from "@shared/vault";
import { apiClient } from "./apiClient";

export type VaultsApiResponse = {
  data: Vault[];
  total: number;
};

function parseApiError(err: unknown): Error {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as
      | { message?: string; error?: string }
      | undefined;
    const msg =
      body?.message ??
      body?.error ??
      err.message ??
      "Request to /api/vaults failed.";
    return new Error(msg);
  }
  if (err instanceof Error) return err;
  return new Error("Failed to fetch vaults.");
}

export async function fetchVaults(): Promise<Vault[]> {
  try {
    const { data } = await apiClient.get<VaultsApiResponse>("/api/vaults");
    const vaults = data.data ?? [];
    const usdcOnly = vaults.filter(
      (v) => v.tokenSymbol?.toUpperCase() === "USDC",
    );
    usdcOnly.sort((a, b) => b.apyPercent - a.apyPercent);
    return usdcOnly;
  } catch (e) {
    throw parseApiError(e);
  }
}

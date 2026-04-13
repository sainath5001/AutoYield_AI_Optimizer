import type { VaultApyProfileDto } from "@shared/vaultApyTrend";
import axios from "axios";
import { apiClient } from "./apiClient";

export async function fetchVaultApyProfile(
  chainId: number,
  vaultAddress: string,
): Promise<VaultApyProfileDto> {
  const path = `/api/vault-detail/${chainId}/${vaultAddress}`;
  try {
    const { data } = await apiClient.get<VaultApyProfileDto>(path);
    return data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      throw new Error(
        "APY profile unavailable for this vault right now (LI.FI Earn indexing).",
      );
    }
    throw e instanceof Error ? e : new Error("Failed to load vault APY profile.");
  }
}

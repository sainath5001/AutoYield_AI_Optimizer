import axios from "axios";
import { apiClient } from "./apiClient";

export type EarnPosition = {
  chainId: number;
  protocolName: string;
  asset: {
    symbol: string;
    address: string;
    decimals?: number;
  };
  balanceUsd: string;
  balanceNative: string;
};

export async function fetchEarnPositions(
  walletAddress: string,
): Promise<EarnPosition[]> {
  try {
    const { data } = await apiClient.get<{
      positions: EarnPosition[];
      total: number;
    }>(`/api/portfolio/${walletAddress}`);
    return data.positions ?? [];
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const msg =
        (e.response?.data as { message?: string })?.message ?? e.message;
      throw new Error(msg);
    }
    throw e instanceof Error ? e : new Error("Portfolio fetch failed");
  }
}

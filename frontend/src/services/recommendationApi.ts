import type {
  AiRecommendationResponse,
  UserPreference,
} from "@shared/recommendation";
import type { Vault } from "@shared/vault";
import axios from "axios";
import { apiClient } from "./apiClient";

export async function fetchAiRecommendation(
  vaults: Vault[],
  preference: UserPreference,
): Promise<AiRecommendationResponse> {
  try {
    const { data } = await apiClient.post<AiRecommendationResponse>(
      "/api/recommendation",
      { vaults, preference },
    );
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const msg =
        (e.response?.data as { message?: string } | undefined)?.message ??
        e.message;
      throw new Error(msg);
    }
    throw e instanceof Error ? e : new Error("Recommendation request failed");
  }
}

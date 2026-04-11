import type { UserPreference } from "@shared/recommendation";
import type { Vault } from "@shared/vault";

/** Picks a vault from the loaded list based on preference (rules-based “AI”). */
export function selectRecommendationForPreference(
  preference: UserPreference,
  vaults: Vault[],
): Vault | null {
  if (vaults.length === 0) return null;

  const sortedByApy = [...vaults].sort((a, b) => b.apyPercent - a.apyPercent);

  if (preference === "high_yield") {
    return sortedByApy[0] ?? null;
  }
  if (preference === "safe") {
    const low = vaults.filter((v) => v.riskLevel === "low");
    const pool = low.length > 0 ? low : vaults;
    return [...pool].sort((a, b) => b.apyPercent - a.apyPercent)[0] ?? null;
  }
  const medium = vaults.filter((v) => v.riskLevel === "medium");
  if (medium.length > 0) {
    return [...medium].sort((a, b) => b.apyPercent - a.apyPercent)[0] ?? null;
  }
  return sortedByApy[Math.floor(sortedByApy.length / 2)] ?? null;
}

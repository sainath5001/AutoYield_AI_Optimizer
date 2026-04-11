import type { UserPreference } from "@shared/recommendation";
import type { Vault } from "@shared/vault";

/** Demo opportunities until LI.FI Earn is wired in a later prompt. */
export const MOCK_YIELD_OPPORTUNITIES: Vault[] = [
  {
    id: "mock-aave-arb-usdc",
    chainId: 42161,
    chainName: "Arbitrum",
    protocol: "Aave V3",
    tokenSymbol: "USDC",
    tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    apyPercent: 6.42,
    riskLevel: "low",
  },
  {
    id: "mock-morpho-eth-weth",
    chainId: 1,
    chainName: "Ethereum",
    protocol: "Morpho",
    tokenSymbol: "WETH",
    tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    apyPercent: 4.18,
    riskLevel: "low",
  },
  {
    id: "mock-pendle-arb",
    chainId: 42161,
    chainName: "Arbitrum",
    protocol: "Pendle",
    tokenSymbol: "USDC",
    tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    apyPercent: 8.95,
    riskLevel: "medium",
  },
  {
    id: "mock-euler-eth",
    chainId: 1,
    chainName: "Ethereum",
    protocol: "Euler",
    tokenSymbol: "USDC",
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    apyPercent: 11.2,
    riskLevel: "high",
  },
];

/** Single vault highlighted as the AI pick (mock). */
export const MOCK_AI_RECOMMENDED: Vault = MOCK_YIELD_OPPORTUNITIES[0]!;

/** Picks a demo vault from preference — still mock data, no API. */
export function selectMockRecommendation(
  preference: UserPreference,
  vaults: Vault[] = MOCK_YIELD_OPPORTUNITIES,
): Vault {
  const sortedByApy = [...vaults].sort((a, b) => b.apyPercent - a.apyPercent);
  if (preference === "high_yield") {
    return sortedByApy[0] ?? vaults[0]!;
  }
  if (preference === "safe") {
    return (
      vaults.find((v) => v.riskLevel === "low") ?? vaults[0]!
    );
  }
  return (
    vaults.find((v) => v.riskLevel === "medium") ??
    vaults[Math.floor(vaults.length / 2)]!
  );
}

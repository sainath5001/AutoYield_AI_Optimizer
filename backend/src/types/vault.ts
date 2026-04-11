/**
 * Mirrors `shared/vault.ts` — keep fields in sync for API responses.
 */
export interface Vault {
  id: string;
  chainId: number;
  chainName: string;
  protocol: string;
  tokenSymbol: string;
  tokenAddress: string;
  vaultAddress?: string;
  apyPercent: number;
  riskLevel: "low" | "medium" | "high";
  isTransactional?: boolean;
  metadata?: Record<string, unknown>;
}

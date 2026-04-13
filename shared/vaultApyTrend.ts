/** Rolling-horizon APY profile from LI.FI Earn (single-vault endpoint). */
export type VaultApyProfileDto = {
  chainId: number;
  address: string;
  name: string;
  protocol: string;
  currentApyPercent: number;
  apy1dPercent: number | null;
  apy7dPercent: number | null;
  apy30dPercent: number | null;
  updatedAt: string | null;
};

export type ApyTrendRange = "today" | "7d" | "30d";

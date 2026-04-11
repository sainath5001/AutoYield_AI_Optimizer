/**
 * Shared Earn / vault opportunity shape (LI.FI Earn and related UIs).
 * Extend as you wire the Earn API in later prompts.
 */
export interface Vault {
    id: string;
    chainId: number;
    chainName: string;
    protocol: string;
    tokenSymbol: string;
    tokenAddress: string;
    /** Optional vault / pool contract when exposed by the API */
    vaultAddress?: string;
    apyPercent: number;
    riskLevel: "low" | "medium" | "high";
    /** From Earn API: Composer deposit available when true */
    isTransactional?: boolean;
    metadata?: Record<string, unknown>;
}
//# sourceMappingURL=vault.d.ts.map
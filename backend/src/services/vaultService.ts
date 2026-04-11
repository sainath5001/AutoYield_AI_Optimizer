import axios from "axios";
import type { Vault } from "../types/vault";

const EARN_BASE = "https://earn.li.fi/v1/earn";

/** Chains aligned with the frontend wagmi config (Ethereum + Arbitrum). */
const VAULT_CHAIN_IDS = [1, 42161] as const;

/** LI.FI Earn NormalizedVault (subset used for mapping). */
export interface EarnVaultApi {
  address: string;
  chainId: number;
  network: string;
  slug: string;
  name: string;
  protocol: { name: string };
  underlyingTokens: { symbol: string; address: string; decimals?: number }[];
  analytics?: {
    apy?: {
      total?: number | null;
      base?: number | null;
      reward?: number | null;
    } | null;
  };
  tags?: string[];
  isTransactional?: boolean;
}

interface EarnVaultsListResponse {
  data: EarnVaultApi[];
  total?: number;
}

function buildHeaders(): Record<string, string> {
  const key = process.env.LIFI_API_KEY;
  if (key) {
    return { "x-lifi-api-key": key };
  }
  return {};
}

/** Earn returns APY either as a fraction (e.g. 0.0534 → 5.34%) or as a percent value (>1, e.g. 16.52). */
function apyTotalToPercent(raw: number | null | undefined): number {
  if (raw == null || Number.isNaN(raw)) return 0;
  if (raw > 1) return raw;
  return raw * 100;
}

function inferRiskLevel(vault: EarnVaultApi): Vault["riskLevel"] {
  const apyPercent = apyTotalToPercent(vault.analytics?.apy?.total);
  const tags = vault.tags ?? [];
  if (tags.some((t) => /leverage|boosted|points|yo-/i.test(t))) {
    return "high";
  }
  if (apyPercent >= 18) {
    return "high";
  }
  if (apyPercent >= 10) {
    return "medium";
  }
  return "low";
}

function formatChainName(network: string): string {
  if (!network) return "Unknown";
  return network.charAt(0).toUpperCase() + network.slice(1).toLowerCase();
}

function mapEarnVault(vault: EarnVaultApi): Vault | null {
  const underlying = vault.underlyingTokens?.[0];
  if (!underlying || underlying.symbol?.toUpperCase() !== "USDC") {
    return null;
  }

  const apyPercent = apyTotalToPercent(vault.analytics?.apy?.total);

  return {
    id: vault.slug,
    chainId: vault.chainId,
    chainName: formatChainName(vault.network),
    protocol: vault.protocol?.name ?? "Unknown",
    tokenSymbol: underlying.symbol,
    tokenAddress: underlying.address,
    vaultAddress: vault.address,
    apyPercent,
    riskLevel: inferRiskLevel(vault),
    isTransactional: vault.isTransactional,
    metadata: {
      name: vault.name,
      slug: vault.slug,
    },
  };
}

/**
 * Fetches USDC vaults from LI.FI Earn for Ethereum + Arbitrum, merges, dedupes,
 * and sorts by highest APY first.
 */
export async function fetchVaults(): Promise<Vault[]> {
  const headers = buildHeaders();
  const merged: Vault[] = [];

  for (const chainId of VAULT_CHAIN_IDS) {
    const { data: body } = await axios.get<EarnVaultsListResponse>(
      `${EARN_BASE}/vaults`,
      {
        params: {
          chainId,
          asset: "USDC",
          sortBy: "apy",
          limit: 100,
        },
        headers,
        timeout: 45_000,
        validateStatus: (s) => s >= 200 && s < 300,
      },
    );

    const rows = body.data ?? [];
    for (const row of rows) {
      const mapped = mapEarnVault(row);
      if (mapped) {
        merged.push(mapped);
      }
    }
  }

  const seen = new Set<string>();
  const deduped = merged.filter((v) => {
    const key = `${v.chainId}-${(v.vaultAddress ?? v.id).toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => b.apyPercent - a.apyPercent);

  return deduped;
}

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

/**
 * Normalize Earn `analytics.apy.total` to a display APY (%).
 *
 * Upstream data mixes units:
 * - `(0, 1]` → decimal fraction per LI.FI docs (e.g. 0.052 → 5.2%).
 * - `(1, 100]` → already in “percent points” (e.g. 9.08 → 9.08%, 16.52 → 16.52%).
 * - `> 100` → some indexers return 100× inflated figures (e.g. 1530 → 15.3%, 268 → 2.69%).
 */
function normalizeEarnApyToPercent(raw: number | null | undefined): number {
  if (raw == null || Number.isNaN(raw) || raw < 0) return 0;
  if (raw <= 1) return raw * 100;
  if (raw <= 100) return raw;
  return raw / 100;
}

/** Stablecoin USDC: APY-based risk bands (no tag heuristics). */
function riskLevelFromApy(apyPercent: number): Vault["riskLevel"] {
  if (apyPercent < 5) return "low";
  if (apyPercent <= 10) return "medium";
  return "high";
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

  const apyPercent = normalizeEarnApyToPercent(vault.analytics?.apy?.total);

  return {
    id: vault.slug,
    chainId: vault.chainId,
    chainName: formatChainName(vault.network),
    protocol: vault.protocol?.name ?? "Unknown",
    tokenSymbol: underlying.symbol,
    tokenAddress: underlying.address,
    vaultAddress: vault.address,
    apyPercent,
    riskLevel: riskLevelFromApy(apyPercent),
    isTransactional: vault.isTransactional,
    metadata: {
      name: vault.name,
      slug: vault.slug,
    },
  };
}

function dedupeKeyProtocolChainToken(v: Vault): string {
  const p = v.protocol.trim().toLowerCase();
  const t = v.tokenSymbol.trim().toUpperCase();
  return `${p}|${v.chainId}|${t}`;
}

/**
 * Keep one vault per (protocol + chainId + token); if duplicates, keep highest APY.
 */
function dedupeByProtocolChainToken(vaults: Vault[]): Vault[] {
  const best = new Map<string, Vault>();
  for (const v of vaults) {
    const key = dedupeKeyProtocolChainToken(v);
    const cur = best.get(key);
    if (!cur || v.apyPercent > cur.apyPercent) {
      best.set(key, v);
    }
  }
  return Array.from(best.values());
}

/**
 * Filters outliers, dedupes, sorts by APY desc, caps at 10, reapplies risk from APY.
 * Full `Vault` objects are preserved for API compatibility with the frontend.
 */
export function processVaultCandidates(merged: Vault[]): Vault[] {
  const filtered = merged.filter(
    (v) => v.apyPercent > 0 && v.apyPercent <= 25,
  );
  const deduped = dedupeByProtocolChainToken(filtered);
  deduped.sort((a, b) => b.apyPercent - a.apyPercent);
  const top = deduped.slice(0, 10);
  return top.map((v) => ({
    ...v,
    riskLevel: riskLevelFromApy(v.apyPercent),
  }));
}

/**
 * Fetches USDC vaults from LI.FI Earn for Ethereum + Arbitrum, then applies
 * {@link processVaultCandidates}.
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

    // eslint-disable-next-line no-console -- debug trace for LI.FI Earn source verification
    console.log("[RAW_LIFI_RESPONSE] request", {
      method: "GET",
      url: `${EARN_BASE}/vaults`,
      chainId,
      params: { asset: "USDC", sortBy: "apy", limit: 100 },
      hasApiKeyHeader: Boolean(headers["x-lifi-api-key"]),
    });
    // eslint-disable-next-line no-console -- debug trace for LI.FI Earn source verification
    console.log(
      "[RAW_LIFI_RESPONSE] full_raw_api_response",
      JSON.stringify(body),
    );

    const rows = body.data ?? [];
    for (const row of rows) {
      const mapped = mapEarnVault(row);
      if (mapped) {
        merged.push(mapped);
      }
    }
  }

  // eslint-disable-next-line no-console -- debug trace for LI.FI Earn source verification
  console.log(
    "[RAW_LIFI_RESPONSE] vault_list_before_filtering",
    JSON.stringify({
      count: merged.length,
      vaults: merged,
    }),
  );

  return processVaultCandidates(merged);
}

import axios from "axios";
import { normalizeEarnApyToPercent } from "../utils/earnApyNormalize";

const EARN_BASE = "https://earn.li.fi/v1/earn";

function buildHeaders(): Record<string, string> {
  const key = process.env.LIFI_API_KEY;
  if (key) return { "x-lifi-api-key": key };
  return {};
}

/** Subset of NormalizedVault.analytics — see https://docs.li.fi/earn/how-it-works */
interface EarnAnalyticsDetail {
  apy?: {
    total?: number | null;
    base?: number | null;
    reward?: number | null;
  } | null;
  /** Rolling average APY — same units as `apy.total`, may be null for new vaults */
  apy1d?: number | null;
  apy7d?: number | null;
  apy30d?: number | null;
  updatedAt?: string;
}

interface EarnVaultDetailResponse {
  address: string;
  chainId: number;
  name: string;
  protocol?: { name?: string };
  analytics?: EarnAnalyticsDetail | null;
}

export type VaultApyProfile = {
  chainId: number;
  address: string;
  name: string;
  protocol: string;
  /** Spot / latest total APY (normalized %) */
  currentApyPercent: number;
  apy1dPercent: number | null;
  apy7dPercent: number | null;
  apy30dPercent: number | null;
  updatedAt: string | null;
};

/**
 * GET /v1/earn/vaults/{chainId}/{address} — single vault with apy1d/apy7d/apy30d.
 * @see https://docs.li.fi/earn/quickstart
 */
export async function fetchVaultApyProfile(
  chainId: number,
  vaultAddress: string,
): Promise<VaultApyProfile> {
  const addr = vaultAddress.toLowerCase();
  const { data } = await axios.get<EarnVaultDetailResponse>(
    `${EARN_BASE}/vaults/${chainId}/${addr}`,
    {
      headers: buildHeaders(),
      timeout: 45_000,
      validateStatus: (s) => s >= 200 && s < 300,
    },
  );

  const a = data.analytics;
  const total = normalizeEarnApyToPercent(a?.apy?.total);
  const apy1d =
    a?.apy1d != null ? normalizeEarnApyToPercent(a.apy1d) : null;
  const apy7d =
    a?.apy7d != null ? normalizeEarnApyToPercent(a.apy7d) : null;
  const apy30d =
    a?.apy30d != null ? normalizeEarnApyToPercent(a.apy30d) : null;

  return {
    chainId: data.chainId,
    address: data.address,
    name: data.name ?? "Vault",
    protocol: data.protocol?.name ?? "Unknown",
    currentApyPercent: total,
    apy1dPercent: apy1d,
    apy7dPercent: apy7d,
    apy30dPercent: apy30d,
    updatedAt: a?.updatedAt ?? null,
  };
}

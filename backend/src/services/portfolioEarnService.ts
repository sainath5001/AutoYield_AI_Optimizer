import axios from "axios";

const EARN_BASE = "https://earn.li.fi/v1/earn";

function buildHeaders(): Record<string, string> {
  const key = process.env.LIFI_API_KEY;
  if (key) return { "x-lifi-api-key": key };
  return {};
}

/** Earn portfolio position (subset). */
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

export async function fetchWalletPositions(
  walletAddress: string,
): Promise<EarnPosition[]> {
  const path = `${EARN_BASE}/portfolio/${walletAddress}/positions`;
  const { data } = await axios.get<{ positions?: EarnPosition[] }>(path, {
    headers: buildHeaders(),
    timeout: 45_000,
    validateStatus: (s) => s >= 200 && s < 300,
  });

  return Array.isArray(data.positions) ? data.positions : [];
}

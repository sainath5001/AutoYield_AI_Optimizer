import axios from "axios";

const LI_QUEST = "https://li.quest/v1";

export type ComposerQuoteParams = {
  fromChainId: number;
  fromToken: string;
  toToken: string;
  fromAddress: string;
  /** USDC amount in base units (6 decimals), e.g. "1000000" for 1 USDC */
  fromAmount: string;
};

/** LI.FI quote step — includes executable transactionRequest when available */
export type LiFiTransactionRequest = {
  to: string;
  data: string;
  value: string;
  from?: string;
  chainId: number;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
};

export type DepositQuoteResult = {
  transactionRequest: LiFiTransactionRequest;
  estimate?: {
    toAmount?: string;
    toAmountMin?: string;
  };
  raw?: unknown;
};

function buildHeaders(): Record<string, string> {
  const key = process.env.LIFI_API_KEY;
  if (key) return { "x-lifi-api-key": key };
  return {};
}

/**
 * Fetches a same-chain Composer quote: USDC → vault token (vault contract address).
 */
export async function fetchDepositQuote(
  params: ComposerQuoteParams,
): Promise<DepositQuoteResult> {
  const integrator =
    process.env.LIFI_INTEGRATOR ?? "AutoYield_AI_Optimizer";

  const { data } = await axios.get(`${LI_QUEST}/quote`, {
    params: {
      fromChain: params.fromChainId,
      toChain: params.fromChainId,
      fromToken: params.fromToken,
      toToken: params.toToken,
      fromAddress: params.fromAddress,
      toAddress: params.fromAddress,
      fromAmount: params.fromAmount,
      integrator,
    },
    headers: buildHeaders(),
    timeout: 60_000,
    validateStatus: (s) => s >= 200 && s < 300,
  });

  const tr = data?.transactionRequest as LiFiTransactionRequest | undefined;
  if (!tr?.to || !tr?.data) {
    const msg =
      (data as { message?: string })?.message ??
      "No executable route from LI.FI Composer.";
    throw new Error(msg);
  }

  return {
    transactionRequest: tr,
    estimate: data?.estimate,
    raw: data,
  };
}

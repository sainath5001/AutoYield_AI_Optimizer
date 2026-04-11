import axios from "axios";
import { apiClient } from "./apiClient";

export type DepositQuoteBody = {
  fromChainId: number;
  fromToken: string;
  toToken: string;
  fromAddress: string;
  fromAmount: string;
};

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

export type DepositQuoteResponse = {
  transactionRequest: LiFiTransactionRequest;
  estimate?: { toAmount?: string; toAmountMin?: string };
};

export async function requestDepositQuote(
  body: DepositQuoteBody,
): Promise<DepositQuoteResponse> {
  try {
    const { data } = await apiClient.post<DepositQuoteResponse>(
      "/api/deposit-quote",
      body,
    );
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const msg =
        (e.response?.data as { message?: string })?.message ?? e.message;
      throw new Error(msg);
    }
    throw e instanceof Error ? e : new Error("Deposit quote failed");
  }
}

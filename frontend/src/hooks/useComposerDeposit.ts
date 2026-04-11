"use client";

import { useAccount, useChainId, useSendTransaction, useSwitchChain } from "wagmi";
import type { Vault } from "@shared/vault";
import { requestDepositQuote } from "@/services/composerApi";
import type { LiFiTransactionRequest } from "@/services/composerApi";

function toSendArgs(tr: LiFiTransactionRequest) {
  const base = {
    to: tr.to as `0x${string}`,
    data: tr.data as `0x${string}`,
    value: BigInt(tr.value ?? "0"),
    chainId: tr.chainId,
  } as const;

  const gas = tr.gasLimit ? { gas: BigInt(tr.gasLimit) } : {};
  const gp = tr.gasPrice ? { gasPrice: BigInt(tr.gasPrice) } : {};
  const mff = tr.maxFeePerGas
    ? { maxFeePerGas: BigInt(tr.maxFeePerGas) }
    : {};
  const mpf = tr.maxPriorityFeePerGas
    ? { maxPriorityFeePerGas: BigInt(tr.maxPriorityFeePerGas) }
    : {};

  return { ...base, ...gas, ...gp, ...mff, ...mpf };
}

/** `amountUsdc` human string e.g. "10" → base units (6 decimals). */
export function usdcToBaseUnits(amountUsdc: string): string {
  const n = Number.parseFloat(amountUsdc.replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("Enter a valid USDC amount greater than zero.");
  }
  const wei = BigInt(Math.round(n * 1_000_000));
  if (wei <= BigInt(0)) throw new Error("Amount too small.");
  return wei.toString();
}

/**
 * Real deposit: LI.FI Composer quote (backend → li.quest) then wallet signs the
 * returned transaction (often a batched zap via LI.FI executor).
 */
export function useComposerDeposit() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const deposit = async (vault: Vault, amountUsdc: string) => {
    if (!isConnected || !address) {
      throw new Error("Connect your wallet first.");
    }
    if (!vault.vaultAddress) {
      throw new Error("Vault has no on-chain address for Composer.");
    }

    const fromAmount = usdcToBaseUnits(amountUsdc);

    if (vault.chainId !== chainId) {
      if (!switchChainAsync) {
        throw new Error("Network switch is not available for this wallet.");
      }
      await switchChainAsync({ chainId: vault.chainId });
    }

    const { transactionRequest } = await requestDepositQuote({
      fromChainId: vault.chainId,
      fromToken: vault.tokenAddress,
      toToken: vault.vaultAddress,
      fromAddress: address,
      fromAmount,
    });

    await sendTransactionAsync(toSendArgs(transactionRequest));
  };

  return {
    deposit,
    isPending: isPending || isSwitching,
  };
}

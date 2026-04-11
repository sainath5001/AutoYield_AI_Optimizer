"use client";

import { useAccount, useChainId, useSendTransaction, useSwitchChain } from "wagmi";
import { stringToHex } from "viem";
import type { Vault } from "@shared/vault";

/**
 * Demo invest flow: switch to vault chain, then send a zero-value self-tx with
 * calldata marking intent (Composer deposit would replace this in production).
 */
export function useInvestMock() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const invest = async (vault: Vault) => {
    if (!isConnected || !address) {
      throw new Error("Connect your wallet first.");
    }

    if (vault.chainId !== chainId) {
      if (!switchChainAsync) {
        throw new Error("Network switch is not available for this wallet.");
      }
      await switchChainAsync({ chainId: vault.chainId });
    }

    const tag = `AutoYield|invest|${vault.id}|${vault.chainId}`;
    const data = stringToHex(tag);

    await sendTransactionAsync({
      to: address,
      value: BigInt(0),
      data,
    });
  };

  return {
    invest,
    isPending: isPending || isSwitching,
  };
}

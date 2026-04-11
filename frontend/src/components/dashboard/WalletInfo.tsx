"use client";

import { useAccount, useBalance, useChainId, useReadContract } from "wagmi";
import { formatUnits } from "viem";

const USDC_BY_CHAIN: Record<number, `0x${string}`> = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
};

const erc20BalanceAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const usdcAddress = USDC_BY_CHAIN[chainId];

  const { data: ethBal, isLoading: ethLoading } = useBalance({
    address,
    chainId,
    query: { enabled: !!address },
  });

  const { data: usdcBal, isLoading: usdcLoading } = useReadContract({
    address: usdcAddress,
    abi: erc20BalanceAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: !!address && !!usdcAddress },
  });

  const { data: usdcDecimals } = useReadContract({
    address: usdcAddress,
    abi: erc20BalanceAbi,
    functionName: "decimals",
    chainId,
    query: { enabled: !!usdcAddress },
  });

  const usdcFormatted =
    usdcBal !== undefined && usdcDecimals !== undefined
      ? formatUnits(usdcBal, usdcDecimals)
      : null;

  const ethFormatted = ethBal
    ? `${Number.parseFloat(formatUnits(ethBal.value, ethBal.decimals)).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${ethBal.symbol}`
    : null;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6 shadow-xl">
      <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
        Wallet
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Balances on the <strong>active network</strong> (switch chain in the
        wallet to see ETH / USDC elsewhere).
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-zinc-500">Address</p>
          <p className="mt-1 font-mono text-sm text-white">
            {isConnected && address ? truncateAddress(address) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">USDC</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-white">
            {!address
              ? "—"
              : !usdcAddress
                ? "Switch to Ethereum or Arbitrum"
                : usdcLoading
                  ? "…"
                  : usdcFormatted !== null
                    ? `${Number.parseFloat(usdcFormatted).toLocaleString(undefined, { maximumFractionDigits: 4 })} USDC`
                    : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Native</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-white">
            {!address ? "—" : ethLoading ? "…" : ethFormatted ?? "—"}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useAccount } from "wagmi";

const MOCK_USDC = "12,450.00";
const MOCK_ETH = "2.408";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletInfo() {
  const { address, isConnected } = useAccount();

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6 shadow-xl">
      <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
        Wallet
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-zinc-500">Address</p>
          <p className="mt-1 font-mono text-sm text-white">
            {isConnected && address ? truncateAddress(address) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">USDC (mock)</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-white">
            ${MOCK_USDC}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">ETH (mock)</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-white">
            {MOCK_ETH} ETH
          </p>
        </div>
      </div>
    </section>
  );
}

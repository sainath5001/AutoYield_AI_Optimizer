"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

export function AppNavbar() {
  const pathname = usePathname();
  const showConnect = pathname?.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-white transition hover:text-emerald-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
            A
          </span>
          <span className="hidden sm:inline">AutoYield</span>
        </Link>
        {showConnect ? (
          <ConnectButton showBalance={false} chainStatus="icon" />
        ) : (
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            Open dashboard
          </Link>
        )}
      </div>
    </header>
  );
}

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppNavbar } from "./AppNavbar";
import { Web3Providers } from "@/components/providers/Web3Providers";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inDashboard = pathname?.startsWith("/dashboard");

  const content = (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <AppNavbar />
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <>{inDashboard ? <Web3Providers>{content}</Web3Providers> : content}</>
  );
}

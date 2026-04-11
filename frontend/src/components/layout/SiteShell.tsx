"use client";

import type { ReactNode } from "react";
import { AppNavbar } from "./AppNavbar";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <AppNavbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

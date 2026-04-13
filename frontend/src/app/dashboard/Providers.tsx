"use client";

import * as React from "react";
import { Web3Providers } from "@/components/providers/Web3Providers";

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return <Web3Providers>{children}</Web3Providers>;
}


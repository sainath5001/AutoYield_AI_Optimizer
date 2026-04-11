"use client";

import * as React from "react";
import type { Vault } from "@shared/vault";

export type PortfolioPosition = {
  vault: Vault;
  /** Display string e.g. "$1,000.00" */
  amountUsd: string;
  apyPercent: number;
  investedAt: number;
};

type PortfolioContextValue = {
  position: PortfolioPosition | null;
  setPosition: (p: PortfolioPosition | null) => void;
};

const PortfolioContext = React.createContext<PortfolioContextValue | null>(
  null,
);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = React.useState<PortfolioPosition | null>(
    null,
  );

  const value = React.useMemo(
    () => ({ position, setPosition }),
    [position],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = React.useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return ctx;
}

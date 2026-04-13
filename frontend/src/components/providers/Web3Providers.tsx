"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

const wagmiConfig = getDefaultConfig({
  appName: "AutoYield AI Optimizer",
  projectId: walletConnectProjectId,
  chains: [mainnet, arbitrum],
  transports: {
    // Explicit public RPCs — default `http()` may use endpoints that block browser CORS (e.g. eth.merkle.io).
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_MAINNET_RPC_URL ??
        "https://ethereum.publicnode.com",
    ),
    [arbitrum.id]: http(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ??
        "https://arbitrum-one.publicnode.com",
    ),
  },
});

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#10b981",
            accentColorForeground: "white",
            borderRadius: "large",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

"use client";

import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig, ensureWeb3Modal } from "@/lib/wagmi-config";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  // wagmiConfig is created with ssr: true, which makes wagmi defer reading
  // persisted wallet state until after hydration on its own — so we don't
  // need to delay rendering children here. Web3Modal just needs to be
  // initialized once on the client.
  useEffect(() => {
    ensureWeb3Modal();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

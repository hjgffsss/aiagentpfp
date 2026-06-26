"use client";

// Wallet connection config using wagmi + WalletConnect (via Web3Modal).
//
// WHY THIS EXISTS: Mobile wallets like Bitget, OKX, Trust Wallet, TokenPocket,
// and SafePal do NOT inject window.ethereum into a mobile browser tab — they
// only work through the WalletConnect protocol (QR code or deep link) or
// their own in-app browser. This config gives every wallet (mobile + desktop)
// one real, working connection path.
//
// SECURITY: This file only ever requests message signing (personal_sign) for
// address verification — see lib/wallet-verify.ts. It is never used to
// request a transaction or token approval. The WalletConnect Project ID
// below is a PUBLIC identifier (not a secret) used to route connection
// requests through WalletConnect's relay network — it is safe to expose in
// client code, the same way a Google Maps API key with domain restrictions
// is safe to expose.

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { mainnet } from "wagmi/chains";

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

const metadata = {
  name: "Crypto Agent",
  description: "2222 Onchain Agents — daily missions, points, and rewards.",
  url: "https://agentpfp.live",
  icons: ["https://agentpfp.live/images/logo.png"],
};

export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet],
  projectId: WALLETCONNECT_PROJECT_ID || "placeholder-project-id",
  metadata,
  ssr: true,
});

let modalInitialized = false;

export function ensureWeb3Modal() {
  if (modalInitialized || typeof window === "undefined") return;
  if (!WALLETCONNECT_PROJECT_ID) {
    console.warn(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Wallet connect will not work until you add a real Project ID from https://cloud.reown.com to your .env.local."
    );
    return;
  }
  createWeb3Modal({
    wagmiConfig,
    projectId: WALLETCONNECT_PROJECT_ID,
    themeMode: "dark",
    themeVariables: {
      "--w3m-color-mix": "#8B5CF6",
      "--w3m-color-mix-strength": 30,
      "--w3m-accent": "#3B82F6",
      "--w3m-border-radius-master": "10px",
    },
  });
  modalInitialized = true;
}

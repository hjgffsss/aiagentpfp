import type { EligibilityResult } from "@/lib/types";

// Placeholder dataset. Replace with a Firestore "whitelist" collection
// lookup once Firebase is configured (see lib/firebase.ts and
// app/api/eligibility/route.ts).
export const MOCK_ELIGIBILITY: EligibilityResult[] = [
  {
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976",
    xUsername: "@agent_alpha",
    role: "GTD",
  },
  {
    walletAddress: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
    xUsername: "@onchain_via",
    role: "WL",
  },
  {
    walletAddress: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    xUsername: "@cryptoagentfan",
    role: "WL",
  },
];

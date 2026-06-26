// Wallet "verification" in this project means signing a plain text message
// (SIWE-style) to prove control of an address. It NEVER requests a token
// approval, a transaction, or any action that could move funds. Do not
// extend this flow to request eth_sendTransaction or contract approvals.

import { ethers } from "ethers";

export function buildSignMessage(address: string, nonce: string) {
  return [
    "Crypto Agent wants you to verify wallet ownership.",
    "",
    `Wallet: ${address}`,
    `Nonce: ${nonce}`,
    "",
    "This request will not trigger any transaction or token approval.",
  ].join("\n");
}

export function generateNonce() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}

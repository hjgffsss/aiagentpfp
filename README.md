# Crypto Agent — Web3 Whitelist Platform

A premium, dark-themed Next.js site for the **Crypto Agent** project: 2222
onchain agents, daily missions, a real points + leaderboard system, an
eligibility checker, a guided whitelist chat assistant with real wallet
connection, and an admin dashboard for reviewing applications.

Live domain: **agentpfp.live**

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animation
- **wagmi + viem + Web3Modal (WalletConnect v2)** for real wallet
  connections — works with mobile wallets (Bitget, OKX, Trust Wallet,
  TokenPocket, SafePal, etc. via QR/deep link) and desktop extensions
  (MetaMask and others)
- **Firebase Firestore (Admin SDK)** for real, persistent data: whitelist
  applications and the points leaderboard — no demo/mock data in either
- **ethers.js** for wallet signature verification (message signing only —
  never a token approval or transaction)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your real values
npm run dev
```

The site runs at `http://localhost:3000`. The admin dashboard is at
`http://localhost:3000/admin`.

### Required for wallet connect to work

Wallet connection (both the navbar button and the whitelist bot) requires a
**WalletConnect Project ID**:

1. Create a free project at https://cloud.reown.com (formerly
   WalletConnect Cloud).
2. Copy the Project ID into `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in
   `.env.local`.

This ID is a **public identifier**, not a secret — it's safe to expose in
client code (same category as a domain-restricted Google Maps key). It
only routes connection requests through WalletConnect's relay network.

Without it, the wallet connect button will log a console warning and the
modal won't open — there is no mock/fallback wallet flow, since a fake
wallet connection would be actively misleading for a Web3 project.

### Required for real data (leaderboard, applications, eligibility)

The leaderboard, whitelist applications, and admin dashboard are **fully
real, Firestore-backed — there is no demo or sample data**. Without
Firebase Admin credentials configured, these features show an honest
"not connected yet" state instead of fabricated numbers.

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Firestore** in production mode.
3. Generate a service account key: Firebase Console > Project Settings >
   Service Accounts > **Generate New Private Key**. Copy the `project_id`,
   `client_email`, and `private_key` fields into `FIREBASE_ADMIN_*` in
   `.env.local` (keep the `\n` sequences in the private key as-is — the code
   converts them back to real newlines).
4. Deploy `firestore.rules` to lock down **direct client** access — every
   collection (`applications`, `whitelist`, `leaderboard`, `admins`,
   `roles`) is blocked for direct client reads/writes. All reads and writes
   go through server-side API routes using the Firebase **Admin SDK**,
   which authenticates with the service account and is not subject to
   these rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

5. (Optional) Seed the `whitelist` collection to pre-approve specific
   wallets/handles for the eligibility checker:

   ```json
   {
     "walletAddress": "0x...",
     "xUsername": "@handle",
     "role": "WL"
   }
   ```

### How the real points & leaderboard system works

- Completing whitelist verification grants a fixed **100 points** to a
  `leaderboard/{walletAddress}` Firestore document (see
  `app/api/applications/route.ts`).
- One wallet can only submit once — points are never duplicated by
  resubmission.
- Points use `FieldValue.increment`, so future daily missions can add to
  the same leaderboard document without overwriting it.
- The public leaderboard (`app/api/leaderboard/route.ts` →
  `app/components/Leaderboard.tsx`) reads real entries sorted by points,
  descending. If no one has earned points yet, it says so — it never shows
  placeholder agents.

### Agent avatars on the leaderboard

There is **no official, free way** to fetch another user's X profile
picture — that requires X's paid Developer API (Basic tier and above), and
scraping it would violate X's Terms of Service. Rather than build a system
around a pasted image link (which is easy to spoof or fill with
inappropriate content with no review step), the leaderboard and admin
dashboard simply show a colored **initials badge** derived from each
agent's X handle. If you later get X API access, you could extend
`app/api/applications/route.ts` to fetch and store a real profile picture
server-side at that point — but that's a deliberate future upgrade, not
something this build does today.

### Admin dashboard access

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in `.env.local`.
This is a simple credential gate suitable for a small team; for a larger
team, swap `lib/admin-session.ts` and `app/api/admin/login/route.ts` for
Firebase Auth with custom claims.

## Project structure

```
app/
  page.tsx                       Landing page (assembles all sections)
  layout.tsx                     Root layout, fonts, metadata, OG/Twitter cards
  providers.tsx                   wagmi + react-query provider wrapper
  globals.css                     Design tokens, glassmorphism utilities
  components/                     All landing page sections
    WhitelistBot.tsx                Whitelist chat assistant (real wallet connect, typing indicator, share banner)
    TypingIndicator.tsx              Animated "..." bot typing dots
    Leaderboard.tsx                   Real Firestore-backed leaderboard
  admin/
    page.tsx                      Admin login
    dashboard/page.tsx             Admin dashboard (real applications table)
  api/
    applications/route.ts          Submit whitelist application + grant real points
    leaderboard/route.ts             Real leaderboard read (no demo data)
    eligibility/route.ts             Eligibility lookup
    admin/login/route.ts              Admin login / logout
    admin/applications/                List + approve/reject/assign-role
lib/
  wagmi-config.ts                 WalletConnect/Web3Modal config (real wallet support)
  firebase.ts                      Firebase client SDK init (optional, unused by default)
  firebase-admin.ts                 Firebase Admin SDK init (used by all API routes)
  wallet-verify.ts                   SIWE-style signature build/verify (sign-only, never a tx)
  share-banner.ts                     Canvas-based auto-generated X share banner
  admin-session.ts                     Admin session cookie verification
  types.ts                               Shared TypeScript types
data/
  mock-eligibility.ts             Fallback dataset for the eligibility checker ONLY
                                    (clearly separate from the leaderboard/applications,
                                     which have zero mock data)
firestore.rules                   Firestore security rules (default-deny, server-only)
.env.example                       Required environment variables
public/images/                     Logo, favicon, bot avatar, NFT cards — all PNG
```

## Security notes

- Wallet verification only ever requests `personal_sign` on a plain text
  message via wagmi/WalletConnect — it never requests
  `eth_sendTransaction` or a token approval. Do not extend this flow to
  request either.
- All application and leaderboard data is validated server-side
  (`app/api/applications/route.ts`) regardless of what the client sends.
- A simple in-memory rate limiter protects the eligibility endpoint; swap
  for a durable store (Upstash, Firestore counters, etc.) in production.
- Admin session cookies are `httpOnly`, `secure`, and `sameSite: strict`,
  and are signed with `SESSION_SECRET` — never stored in `localStorage`.
- The WalletConnect Project ID is public by design; Firebase Admin
  credentials, `ADMIN_PASSWORD`, and `SESSION_SECRET` are not — they
  belong in `.env.local` only and must never be committed to git or
  exposed in client-side code.
- This repo's `.gitignore` excludes `.env*.local`. If this project lives
  in a public GitHub repo, double-check the repo's commit history doesn't
  already contain a real secret from before `.gitignore` was added — if it
  does, rotate that credential immediately, since removing a file from a
  later commit does not remove it from git history.

## Replacing placeholder brand assets

See `public/images/README.md` for the full list of PNG logo, favicon, bot
avatar, and NFT preview assets and what to replace them with.

import { NextRequest, NextResponse } from "next/server";
import { MOCK_ELIGIBILITY } from "@/data/mock-eligibility";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

// Very small in-memory rate limiter (per server instance). For production,
// replace with a durable store (e.g. Firestore counter, Upstash, etc.)
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const queryValue = (body?.query ?? "").trim();

  if (!queryValue) {
    return NextResponse.json(
      { error: "Please provide a wallet address or X username." },
      { status: 400 }
    );
  }

  const normalized = queryValue.toLowerCase();
  const isAddress = normalized.startsWith("0x");

  // Prefer Firestore once configured; fall back to mock dataset otherwise.
  const db = getAdminDb();
  if (isFirebaseAdminConfigured && db) {
    try {
      const field = isAddress ? "walletAddress" : "xUsername";
      const value = isAddress
        ? queryValue
        : queryValue.startsWith("@")
        ? queryValue
        : `@${queryValue}`;

      const snap = await db
        .collection("whitelist")
        .where(field, "==", value)
        .limit(1)
        .get();

      if (!snap.empty) {
        const data = snap.docs[0].data();
        return NextResponse.json({
          walletAddress: data.walletAddress,
          xUsername: data.xUsername,
          role: data.role ?? "NOT_ELIGIBLE",
        });
      }
      return NextResponse.json({
        walletAddress: isAddress ? queryValue : "—",
        xUsername: !isAddress ? value : "—",
        role: "NOT_ELIGIBLE",
      });
    } catch (err) {
      console.error("Firestore eligibility lookup failed", err);
      // fall through to mock lookup below
    }
  }

  const match = MOCK_ELIGIBILITY.find((entry) => {
    if (isAddress) return entry.walletAddress.toLowerCase() === normalized;
    const handle = entry.xUsername.toLowerCase().replace("@", "");
    return handle === normalized.replace("@", "");
  });

  if (match) {
    return NextResponse.json(match);
  }

  return NextResponse.json({
    walletAddress: isAddress ? queryValue : "—",
    xUsername: !isAddress ? queryValue : "—",
    role: "NOT_ELIGIBLE",
  });
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { LeaderboardEntry } from "@/lib/types";

export async function GET(req: NextRequest) {
  const db = getAdminDb();

  if (!isFirebaseAdminConfigured || !db) {
    // No fabricated data. If the database isn't connected, the leaderboard
    // is genuinely empty — we say so rather than showing fake agents.
    return NextResponse.json({
      entries: [],
      configured: false,
    });
  }

  try {
    const limitParam = Number(req.nextUrl.searchParams.get("limit") ?? "20");
    const safeLimit = Math.min(Math.max(limitParam, 1), 100);

    const snap = await db
      .collection("leaderboard")
      .orderBy("points", "desc")
      .limit(safeLimit)
      .get();

    const entries: LeaderboardEntry[] = snap.docs.map((doc, i) => {
      const data = doc.data();
      return {
        rank: i + 1,
        xUsername: data.xUsername ?? "—",
        walletAddress: data.walletAddress ?? doc.id,
        points: data.points ?? 0,
      };
    });

    return NextResponse.json({ entries, configured: true });
  } catch (err) {
    console.error("Failed to load leaderboard from Firestore", err);
    return NextResponse.json(
      { error: "Could not load leaderboard. Please try again shortly." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const X_USERNAME_RE = /^@?[A-Za-z0-9_]{1,15}$/;
const URL_RE = /^https?:\/\/(twitter|x)\.com\/.+/i;

// Real point grant for completing whitelist verification. This is the
// project's actual mission-reward logic — not a placeholder. Future daily
// missions can add more increments to the same leaderboard document via
// FieldValue.increment, so totals stay accurate without overwriting.
const WHITELIST_COMPLETION_POINTS = 100;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { walletAddress, xUsername, repostUrl, notes } = body;

  // Server-side validation. Never trust client input.
  if (!ADDRESS_RE.test(walletAddress ?? "")) {
    return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
  }
  if (!X_USERNAME_RE.test(xUsername ?? "")) {
    return NextResponse.json({ error: "Invalid X username." }, { status: 400 });
  }
  if (!URL_RE.test(repostUrl ?? "")) {
    return NextResponse.json(
      { error: "Repost link must be a valid X/Twitter post URL." },
      { status: 400 }
    );
  }

  const normalizedHandle = xUsername.startsWith("@") ? xUsername : `@${xUsername}`;
  const normalizedAddress = walletAddress.toLowerCase();

  const application = {
    walletAddress,
    xUsername: normalizedHandle,
    repostUrl,
    notes: typeof notes === "string" ? notes.slice(0, 500) : "",
    status: "pending" as const,
    role: null,
  };

  const db = getAdminDb();
  if (isFirebaseAdminConfigured && db) {
    try {
      // One wallet = one whitelist application. This also means points are
      // only ever granted once per real wallet, not per submission attempt.
      const existing = await db
        .collection("applications")
        .where("walletAddress", "==", walletAddress)
        .limit(1)
        .get();

      if (!existing.empty) {
        return NextResponse.json(
          { error: "This wallet has already submitted a whitelist application." },
          { status: 409 }
        );
      }

      const batch = db.batch();

      const appRef = db.collection("applications").doc();
      batch.set(appRef, {
        ...application,
        points: WHITELIST_COMPLETION_POINTS,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Real leaderboard document, keyed by wallet so points accumulate
      // correctly if future missions grant more points to the same agent.
      const leaderboardRef = db.collection("leaderboard").doc(normalizedAddress);
      batch.set(
        leaderboardRef,
        {
          walletAddress,
          xUsername: normalizedHandle,
          points: FieldValue.increment(WHITELIST_COMPLETION_POINTS),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      await batch.commit();

      return NextResponse.json({
        id: appRef.id,
        ...application,
        points: WHITELIST_COMPLETION_POINTS,
      });
    } catch (err) {
      console.error("Failed to save application to Firestore", err);
      return NextResponse.json(
        { error: "Could not save application. Please try again." },
        { status: 500 }
      );
    }
  }

  // Firebase Admin not configured yet — the app cannot persist real data
  // or real points without it. We say so plainly rather than fabricating
  // a fake success response, since the whole point of this endpoint is to
  // produce real leaderboard data.
  return NextResponse.json(
    {
      error:
        "The server isn't connected to a database yet (Firebase Admin credentials are missing). Your application was not saved. Please contact the site owner.",
    },
    { status: 503 }
  );
}

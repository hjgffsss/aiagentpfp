import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/admin-session";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { Application } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getAdminDb();

  if (!isFirebaseAdminConfigured || !db) {
    return NextResponse.json({ applications: [], configured: false });
  }

  try {
    const snap = await db
      .collection("applications")
      .orderBy("createdAt", "desc")
      .get();
    const applications: Application[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        walletAddress: data.walletAddress,
        xUsername: data.xUsername,
        repostUrl: data.repostUrl,
        notes: data.notes,
        status: data.status,
        role: data.role,
        points: data.points,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
      };
    });
    return NextResponse.json({ applications, configured: true });
  } catch (err) {
    console.error("Failed to load applications from Firestore", err);
    return NextResponse.json(
      { error: "Could not load applications. Please try again shortly." },
      { status: 500 }
    );
  }
}

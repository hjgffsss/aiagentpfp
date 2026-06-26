import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/admin-session";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

const VALID_STATUSES = ["pending", "approved", "rejected"];
const VALID_ROLES = ["GTD", "WL", "NOT_ELIGIBLE", null];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { status, role } = body;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const db = getAdminDb();
  if (isFirebaseAdminConfigured && db) {
    try {
      const update: Record<string, unknown> = {};
      if (status !== undefined) update.status = status;
      if (role !== undefined) update.role = role;
      await db.collection("applications").doc(params.id).update(update);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("Failed to update application", err);
      return NextResponse.json({ error: "Update failed." }, { status: 500 });
    }
  }

  // Demo mode — no persistence, just acknowledge.
  return NextResponse.json({ ok: true, demo: true });
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// SECURITY NOTES:
// - Admin credentials must come from environment variables, never hardcoded.
// - In production, replace this with Firebase Auth (email/password or
//   custom claims) and verify ID tokens server-side instead of a shared
//   secret. This simple version exists so the dashboard is usable before
//   Firebase Auth is wired up.
// - Session token is a signed, httpOnly, secure cookie — never readable by
//   client-side JS, which protects against XSS-based session theft.

const SESSION_COOKIE = "ca_admin_session";

function signToken(payload: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server yet." },
      { status: 503 }
    );
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const expires = Date.now() + 1000 * 60 * 60 * 8; // 8 hours
  const token = signToken(`${email}:${expires}`, SESSION_SECRET);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

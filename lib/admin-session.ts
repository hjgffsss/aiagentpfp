import crypto from "crypto";
import { NextRequest } from "next/server";

const SESSION_COOKIE = "ca_admin_session";

export function isValidAdminSession(req: NextRequest): boolean {
  const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) return false;

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return false;

  const lastDot = cookie.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = cookie.slice(0, lastDot);
  const signature = cookie.slice(lastDot + 1);

  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (signature !== expected) return false;

  const [email, expiresStr] = payload.split(":");
  if (email !== ADMIN_EMAIL) return false;
  if (Date.now() > Number(expiresStr)) return false;

  return true;
}

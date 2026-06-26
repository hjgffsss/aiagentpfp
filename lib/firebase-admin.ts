// Firebase ADMIN SDK setup — used only inside server-side code (API routes).
// This module must never be imported from a "use client" component; it
// relies on a service account private key that must stay server-only.
//
// This is what allows app/api/* routes to read/write Firestore even though
// firestore.rules blocks all direct client access — the Admin SDK
// authenticates with elevated, server-only privileges and is not subject
// to security rules.

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;
let db: Firestore | null = null;

function buildCredential() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Private keys in .env files often have literal "\n" sequences instead
  // of real newlines — this restores them.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) return null;
  return { projectId, clientEmail, privateKey };
}

export const isFirebaseAdminConfigured = Boolean(buildCredential());

export function getAdminDb(): Firestore | null {
  const credential = buildCredential();
  if (!credential) return null;

  if (!app) {
    app = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert(credential) });
  }
  if (!db) db = getFirestore(app);
  return db;
}

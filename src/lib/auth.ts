import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession, type SessionPayload } from "./session";

export async function createSession(user: { id: string; email: string; name: string; role: string }) {
  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  // Readable hint for the public site: shows the "edit this page" button. Grants nothing — the admin still checks the real session.
  (await cookies()).set(ADMIN_HINT_COOKIE, "1", { sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS });
}

export const ADMIN_HINT_COOKIE = "yeg_admin_hint";

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
  (await cookies()).delete(ADMIN_HINT_COOKIE);
}

/** Verifies the cookie AND that the user still exists — the proxy check alone is only optimistic. */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await db.user.findUnique({ where: { id: session.sub }, select: { id: true } });
  return user ? session : null;
});

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

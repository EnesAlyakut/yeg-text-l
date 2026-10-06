// Edge-safe session helpers shared by proxy.ts and server code (no Prisma imports here).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "yeg_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = { sub: string; email: string; name: string; role: string };

function key() {
  const secret =
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "yeg-local-dev-secret-do-not-use-in-production-000000");
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

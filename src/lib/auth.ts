import { createHmac, timingSafeEqual } from "crypto";
import { COOKIE_NAME } from "@/lib/auth-constants";

/**
 * Authentification admin — token de session signé (HMAC-SHA256).
 * Le token est stocké dans un cookie HTTP-only ; sa validité est vérifiée
 * côté serveur (server components + server actions) et le middleware
 * redirige les visiteurs non authentifiés.
 *
 * La constante COOKIE_NAME est isolée dans auth-constants.ts afin que le
 * middleware (runtime Edge) n'embarque pas `node:crypto`.
 */

export { COOKIE_NAME };
export const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 heures

/** Identité portée par la session (extraite du token vérifié). */
export type SessionUser = {
  userId: number;
  email: string;
  role: "admin" | "client";
};

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    "dev-only-insecure-secret-please-set-SESSION_SECRET-in-env"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/** Crée un token signé pour un utilisateur donné. */
export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    id: user.userId,
    email: user.email,
    role: user.role,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  });
  const enc = Buffer.from(payload).toString("base64url");
  return `${enc}.${sign(enc)}`;
}

/** Vérifie l'intégrité et l'expiration d'un token. */
export function verifySessionToken(
  token: string | undefined | null,
): SessionUser | null {
  if (!token) return null;
  const [enc, sig] = token.split(".");
  if (!enc || !sig) return null;

  // Comparaison à temps constant pour éviter le timing attack.
  const expected = sign(enc);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(enc, "base64url").toString("utf8"),
    ) as { id?: number; email?: string; role?: string; exp?: number };
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    if (typeof payload.id !== "number" || !payload.email) return null;
    const role: SessionUser["role"] =
      payload.role === "admin" ? "admin" : "client";
    return { userId: payload.id, email: payload.email, role };
  } catch {
    return null;
  }
}

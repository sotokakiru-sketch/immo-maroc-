import { cookies, headers } from "next/headers";
import {
  COOKIE_NAME,
  MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
  type SessionUser,
} from "@/lib/auth";

export type Session = SessionUser | null;

/** Lit et vérifie la session courante (côté serveur). */
export async function getSession(): Promise<Session> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** Indique si l'utilisateur dispose d'une session valide (admin ou client). */
export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

/** Démarre une session (cookie HTTP-only signé). */
export async function setSession(user: SessionUser): Promise<void> {
  // `secure` est adaptatif : actif en HTTPS (production), désactivé en HTTP,
  // pour rester fonctionnel en local tout en sécurisant le déploiement.
  const h = await headers();
  const isHttps = h.get("x-forwarded-proto") === "https";
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Détruit la session admin. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

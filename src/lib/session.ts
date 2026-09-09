import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, type SessionUser } from "@/lib/auth-constants";

export type Session = SessionUser | null;

/** Lit et vérifie la session courante (côté serveur). */
export async function getSession(): Promise<Session> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const name = typeof meta?.name === "string" ? meta.name : undefined;

  return {
    userId: user.id,
    email: user.email,
    role: isAdminEmail(user.email) ? "admin" : "client",
    ...(name ? { name } : {}),
  };
}

/** Indique si l'utilisateur dispose d'une session valide. */
export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

/** Déconnecte l'utilisateur (détruit les cookies de session Supabase). */
export async function clearSession(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
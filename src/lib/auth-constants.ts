/**
 * Comptes administrateurs : identifiés par e-mail (allowlist).
 * Aucun compte n'est recréé ni modifié : on dérive simplement le rôle
 * admin/client de l'adresse e-mail de l'utilisateur Supabase Auth.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "immomaroc.org@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/** Identité portée par la session (dérivée de l'utilisateur Supabase Auth). */
export type SessionUser = {
  userId: string; // UUID Supabase Auth
  email: string;
  role: "admin" | "client";
  name?: string;
};
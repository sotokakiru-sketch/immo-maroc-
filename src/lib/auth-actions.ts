"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { setSession, clearSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";

export type AuthState = { ok: boolean; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Crée un compte CLIENT unique (l'inscription publique ne permet JAMAIS de
 * devenir administrateur). Les comptes admin sont créés exclusivement via un
 * script serveur (seed-admin.mjs) ou directement en base.
 */
export async function signupAction(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  // Sécurité : on force toujours le rôle "client", peu importe ce qui est envoyé.
  const role = "client";

  if (!name) return { ok: false, message: "Le nom est obligatoire." };
  if (!EMAIL_RE.test(email))
    return { ok: false, message: "Adresse e-mail invalide." };
  if (password.length < 8)
    return {
      ok: false,
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    };
  if (password !== confirm)
    return { ok: false, message: "Les mots de passe ne correspondent pas." };

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));
  if (existing)
    return { ok: false, message: "Un compte existe déjà avec cet e-mail." };

  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash: hashPassword(password), role })
    .returning({ id: users.id, email: users.email });

  if (!user) {
    return { ok: false, message: "Impossible de créer le compte." };
  }

  await setSession({ userId: user.id, email: user.email, role });
  revalidatePath("/", "layout");
  redirect("/mon-compte");
}

/** Authentifie un utilisateur existant (admin ou client). */
export async function loginAction(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password)
    return { ok: false, message: "Veuillez remplir tous les champs." };

  // Recherche de l'utilisateur — protégée contre les erreurs de base.
  let user: User | null = null;
  try {
    const rows = await db.select().from(users).where(eq(users.email, email));
    user = rows[0] ?? null;
  } catch (err) {
    console.error("[DarFind] loginAction — échec de lecture de la base :", err);
    return {
      ok: false,
      message: "Connexion impossible pour le moment, réessayez dans un instant.",
    };
  }

  // Même message en cas d'utilisateur ou de mot de passe invalide (anti-énumération).
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, message: "E-mail ou mot de passe incorrect." };
  }

  // Création de la session — protégée contre une écriture de cookie impossible.
  try {
    await setSession({
      userId: user.id,
      email: user.email,
      role: user.role ?? "client",
    });
  } catch (err) {
    console.error("[DarFind] loginAction — erreur inattendue :", err);
    return {
      ok: false,
      message: "Connexion impossible pour le moment, réessayez dans un instant.",
    };
  }

  revalidatePath("/", "layout");
  redirect(user.role === "admin" ? "/admin" : "/mon-compte");
}

/** Déconnecte l'utilisateur. */
export async function logoutAction(): Promise<void> {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/");
}

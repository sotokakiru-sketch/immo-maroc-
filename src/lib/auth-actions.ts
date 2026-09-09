"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth-constants";
import { clearSession } from "@/lib/session";

export type AuthState = { ok: boolean; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Crée un compte CLIENT via Supabase Auth (l'inscription publique ne permet
 * JAMAIS de devenir administrateur : le rôle admin est réservé aux e-mails
 * listés dans ADMIN_EMAILS). Aucun compte existant n'est modifié.
 */
export async function signupAction(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role: "client" } },
  });

  if (error) {
    console.error("[DarFind] signupAction — Supabase Auth :", error.message);
    const isDuplicate =
      error.code === "user_already_exists" ||
      error.message.toLowerCase().includes("already registered");
    return {
      ok: false,
      message: isDuplicate
        ? "Un compte existe déjà avec cet e-mail."
        : `Inscription impossible : ${error.message}`,
    };
  }

  // Si la confirmation par e-mail est activée, aucune session n'est créée :
  // on invite l'utilisateur à confirmer son adresse avant de se connecter.
  if (!data.session) {
    return {
      ok: true,
      message:
        "Compte créé ! Confirmez votre adresse e-mail, puis connectez-vous.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/mon-compte");
}

/**
 * Authentifie un utilisateur existant (admin ou client) via
 * supabase.auth.signInWithPassword(). L'erreur réelle de Supabase Auth est
 * renvoyée au formulaire (plus de message générique masquant la cause).
 */
export async function loginAction(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password)
    return { ok: false, message: "Veuillez remplir tous les champs." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[DarFind] loginAction — Supabase Auth :", error.message);
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login credentials"))
      return { ok: false, message: "E-mail ou mot de passe incorrect." };
    if (msg.includes("email not confirmed"))
      return {
        ok: false,
        message: "Votre adresse e-mail n'a pas encore été confirmée.",
      };
    // Erreur réelle Supabase Auth, affichée telle quelle (diagnostic).
    return { ok: false, message: `Connexion impossible : ${error.message}` };
  }

  const role =
    data.user?.email && isAdminEmail(data.user.email) ? "admin" : "client";

  revalidatePath("/", "layout");
  redirect(role === "admin" ? "/admin" : "/mon-compte");
}

/** Déconnecte l'utilisateur. */
export async function logoutAction(): Promise<void> {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/");
}
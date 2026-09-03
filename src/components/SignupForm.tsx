"use client";

import { useActionState } from "react";
import {
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { signupAction, type AuthState } from "@/lib/auth-actions";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    signupAction,
    null,
  );
  const error = state && !state.ok ? state.message : null;

  return (
    <form action={formAction} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl border border-sand-200 bg-sand-50 p-3.5 text-xs leading-relaxed text-brand-500">
        Vous créez un <strong className="text-brand-700">compte client</strong>{" "}
        pour suivre les biens et contacter l&apos;agence.
      </div>

      {/* Nom */}
      <div>
        <label className="field-label" htmlFor="name">
          Nom complet
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300" />
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="field-input pl-11"
            placeholder="Ex : Karim Bennani"
          />
        </div>
      </div>

      {/* E-mail */}
      <div>
        <label className="field-label" htmlFor="email">
          Adresse e-mail
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field-input pl-11"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      {/* Mot de passe */}
      <div>
        <label className="field-label" htmlFor="password">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="field-input pl-11"
            placeholder="Au moins 8 caractères"
          />
        </div>
      </div>

      {/* Confirmation */}
      <div>
        <label className="field-label" htmlFor="confirm">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300" />
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="field-input pl-11"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Création du compte…
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Créer mon compte
          </>
        )}
      </button>
    </form>
  );
}

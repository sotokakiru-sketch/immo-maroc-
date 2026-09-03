"use client";

import { useActionState } from "react";
import { Mail, Lock, Loader2, AlertCircle, LogIn } from "lucide-react";
import { loginAction, type AuthState } from "@/lib/auth-actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    loginAction,
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
            placeholder="admin@immomaroc.ma"
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
            autoComplete="current-password"
            required
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
            Connexion…
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Se connecter
          </>
        )}
      </button>
    </form>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Bug } from "lucide-react";

/**
 * Frontière d'erreur App Router (segment de page).
 * Capture les erreurs rendues dans les pages : affiche un écran clair,
 * loggue côté client, et propose de réessayer ou de revenir à l'accueil.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DarFind] Erreur de page capturée :", error);
  }, [error]);

  return (
    <section className="grid min-h-[70vh] place-items-center bg-sand-50 px-6 pt-28 pb-16">
      <div className="w-full max-w-lg rounded-3xl border border-sand-200 bg-white p-8 text-center shadow-luxe sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle className="h-8 w-8" />
        </span>

        <h1 className="mt-6 font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          Une erreur est survenue
        </h1>
        <p className="mt-2 text-brand-500">
          Désolé, la page n&apos;a pas pu être chargée correctement. Vous pouvez
          réessayer ou revenir à l&apos;accueil.
        </p>

        {/* Encart de debug — affiche error.message (à masquer en production). */}
        {error?.message && (
          <details className="mt-6 rounded-xl border border-sand-200 bg-sand-50 p-4 text-left">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-700">
              <Bug className="h-4 w-4 text-gold-500" />
              Détails techniques (debug)
            </summary>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-xs text-red-600">
              {error.message}
              {error.digest ? `\n\ndigest: ${error.digest}` : ""}
            </pre>
          </details>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn btn-primary">
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </button>
          <Link href="/" className="btn btn-ghost">
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Bug } from "lucide-react";
import "./globals.css";

/**
 * Frontière d'erreur GLOBALE : capture les erreurs survenant dans le layout
 * racine lui-même (ex. connexion base dans getSession, erreur fatale serveur).
 * Elle remplace entièrement le <html>/<body> : elle doit donc les recréer et
 * importer le CSS du design system (couleurs brand/gold/sand).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DarFind] Erreur globale (layout racine) capturée :", error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <section className="grid min-h-screen place-items-center bg-brand-950 px-6 py-16">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/95 p-8 text-center shadow-luxe sm:p-10">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </span>

            <h1 className="mt-6 font-display text-2xl font-bold text-brand-900 sm:text-3xl">
              Erreur critique de l&apos;application
            </h1>
            <p className="mt-2 text-brand-500">
              Le site n&apos;a pas pu démarrer correctement (problème de
              connexion ou de configuration). Merci de réessayer dans un
              instant.
            </p>

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
                Retour à l&apos;accueil
              </Link>
            </div>

            <p className="mt-6 text-xs text-brand-400">
              Vérifiez que la base de données est accessible et que les variables
              d&apos;environnement sont correctement configurées.
            </p>
          </div>
        </section>
      </body>
    </html>
  );
}

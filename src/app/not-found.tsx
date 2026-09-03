import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-brand-950 px-6 pt-20 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-gold-500 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
          Cette adresse n&apos;existe pas
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sand-300">
          La page que vous cherchez a été déplacée ou n&apos;existe plus.
          Revenons à des horizons plus connus.
        </p>
        <Link href="/" className="btn btn-gold mt-8">
          <Home className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>
        <div className="mt-4">
          <Link
            href="/biens"
            className="inline-flex items-center gap-2 text-sm text-sand-200 transition-colors hover:text-gold-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Voir tous les biens
          </Link>
        </div>
      </div>
    </section>
  );
}

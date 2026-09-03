import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus, ShieldCheck, ArrowLeft } from "lucide-react";
import SignupForm from "@/components/SignupForm";
import Logo from "@/components/Logo";
import { AGENCY } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte client ou administrateur Immo Maroc.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-brand-950 px-6 pt-32 pb-16">
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-sand-300 transition-colors hover:text-gold-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/95 p-8 shadow-luxe backdrop-blur sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Logo variant="color" className="justify-center" />
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
              <UserPlus className="h-4 w-4" />
              Inscription
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold text-brand-900">
              Créer un compte client
            </h1>
            <p className="mt-2 text-sm text-brand-500">
              Inscrivez-vous pour suivre les biens et contacter
              l&apos;agence en un clic.
            </p>
          </div>

          <div className="mt-8">
            <SignupForm />
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-800"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-sand-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          {AGENCY.name} — Espace sécurisé · {AGENCY.city}
        </p>
      </div>
    </section>
  );
}

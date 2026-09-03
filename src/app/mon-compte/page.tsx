import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  UserCircle,
  Mail,
  Search,
  Heart,
  Phone,
  MapPin,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AGENCY } from "@/lib/constants";
import { getAllProperties } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};

export default async function MonComptePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profile] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));

  const recent = (await getAllProperties()).slice(0, 3);
  const initials = (profile?.name ?? "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-sand-100 pt-36 pb-20">
      <div className="container-x">
        {/* En-tête profil */}
        <div className="flex flex-col gap-5 rounded-2xl border border-sand-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:p-8">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-700 font-display text-xl font-bold text-gold-400">
            {initials}
          </span>
          <div className="flex-1">
            <span className="eyebrow">
              <UserCircle className="h-3.5 w-3.5" />
              Espace personnel
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold text-brand-900 sm:text-3xl">
              Bonjour, {profile?.name?.split(" ")[0] ?? "cher client"} 👋
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-500">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-gold-500" />
                {session.email}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold-500" />
                {session.role === "admin" ? "Administrateur" : "Client"}
              </span>
            </p>
          </div>
        </div>

        {/* Cartes d'action */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href="/biens"
            className="group rounded-2xl border border-sand-200 bg-white p-6 shadow-soft transition-transform hover:-translate-y-1"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Search className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">
              Rechercher un bien
            </h3>
            <p className="mt-1 text-sm text-brand-500">
              Parcourez les biens disponibles à Tanger.
            </p>
          </Link>

          <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Heart className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">
              Mes favoris
            </h3>
            <p className="mt-1 text-sm text-brand-500">
              Bientôt : enregistrez vos coups de cœur.
            </p>
          </div>

          <Link
            href={`tel:${AGENCY.phoneTel}`}
            className="group rounded-2xl border border-sand-200 bg-white p-6 shadow-soft transition-transform hover:-translate-y-1"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Phone className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">
              Contacter l&apos;agence
            </h3>
            <p className="mt-1 text-sm text-brand-500">{AGENCY.phoneDisplay}</p>
          </Link>
        </div>

        {/* Accès admin (si administrateur) */}
        {session.role === "admin" && (
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold-300 bg-gold-300/10 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-brand-950">
                <LayoutGrid className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-brand-900">
                  Tableau de bord administrateur
                </h3>
                <p className="text-sm text-brand-600">
                  Publiez, modifiez et gérez les annonces.
                </p>
              </div>
            </div>
            <Link href="/admin" className="btn btn-primary">
              Accéder à l&apos;espace admin
            </Link>
          </div>
        )}

        {/* Dernières annonces */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-brand-900">
              Derniers biens publiés
            </h2>
            <Link
              href="/biens"
              className="text-sm font-semibold text-brand-700 hover:text-gold-600"
            >
              Tout voir
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-sand-300 bg-white py-14 text-center">
              <MapPin className="mx-auto h-10 w-10 text-brand-300" />
              <p className="mt-3 font-display text-lg font-semibold text-brand-900">
                Aucune annonce disponible pour le moment
              </p>
              <p className="mt-1 text-sm text-brand-500">
                Revenez bientôt pour découvrir nos nouveaux biens à Tanger.
              </p>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/biens/${p.id}`}
                    className="flex items-center gap-4 rounded-xl border border-sand-200 bg-white p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <span className="rounded-lg bg-brand-700 px-3 py-1 text-xs font-semibold text-white">
                      {p.type}
                    </span>
                    <span className="flex-1 truncate font-medium text-brand-900">
                      {p.title}
                    </span>
                    <span className="hidden text-sm text-brand-500 sm:block">
                      {p.district ?? p.city}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

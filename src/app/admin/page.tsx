import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Tag,
  Star,
  ExternalLink,
  Pencil,
  LogOut,
  Inbox,
} from "lucide-react";
import PropertyForm from "@/components/PropertyForm";
import DeleteButton from "@/components/DeleteButton";
import { getAllProperties } from "@/lib/data";
import { formatPrice } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Barrière de sécurité serveur : session + rôle admin obligatoires.
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/mon-compte");

  const items = await getAllProperties();
  const featuredCount = items.filter((p) => p.featured).length;

  const stats = [
    { icon: Building2, label: "Annonces totales", value: items.length },
    { icon: Star, label: "Mises en avant", value: featuredCount },
    {
      icon: Tag,
      label: "À vendre",
      value: items.filter((p) => p.status === "Vente").length,
    },
  ];

  return (
    <div className="bg-sand-100 pt-36 pb-20">
      <div className="container-x">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Tableau de bord
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Espace administrateur
            </h1>
            <p className="mt-1 text-brand-600">
              Connecté en tant que{" "}
              <span className="font-semibold text-brand-800">
                {session.email}
              </span>{" "}
              · Gérez le catalogue Immo Maroc.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="btn btn-ghost self-start">
              Voir le site
              <ExternalLink className="h-4 w-4" />
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-ghost self-start text-red-600">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-sand-200 bg-white p-5 shadow-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <s.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-brand-900">
                  {s.value}
                </p>
                <p className="text-sm text-brand-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Formulaire d'ajout */}
          <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl font-bold text-brand-900">
              Ajouter une annonce
            </h2>
            <p className="mt-1 text-sm text-brand-500">
              Tous les champs marqués d&apos;un * sont obligatoires.
            </p>
            <div className="mt-6">
              <PropertyForm />
            </div>
          </div>

          {/* Liste des annonces */}
          <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-brand-900">
                Annonces publiées
              </h2>
              <span className="rounded-full bg-sand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                {items.length}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-sand-300 bg-sand-50 py-14 text-center">
                <Inbox className="h-10 w-10 text-brand-300" />
                <p className="mt-3 font-display text-lg font-semibold text-brand-900">
                  Aucune annonce pour le moment
                </p>
                <p className="mt-1 max-w-xs text-sm text-brand-500">
                  Utilisez le formulaire pour publier votre première annonce.
                  Elle apparaîtra aussitôt sur le site.
                </p>
              </div>
            ) : (
              <div className="mt-5 max-h-[640px] space-y-3 overflow-y-auto pr-1">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-sand-200 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-brand-900">
                          {p.title}
                        </p>
                        {p.featured && (
                          <Star className="h-3.5 w-3.5 shrink-0 fill-gold-400 text-gold-500" />
                        )}
                      </div>
                      <p className="truncate text-xs text-brand-500">
                        {p.district ?? p.city} · {p.type} ·{" "}
                        {formatPrice(p.price)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/admin/modifier/${p.id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-sand-200 text-brand-600 transition-colors hover:bg-sand-50"
                        aria-label="Modifier l'annonce"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/biens/${p.id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-sand-200 text-brand-600 transition-colors hover:bg-sand-50"
                        aria-label="Voir le bien"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <DeleteButton id={p.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

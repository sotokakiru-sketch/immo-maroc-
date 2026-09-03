import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil, ArrowLeft } from "lucide-react";
import PropertyForm from "@/components/PropertyForm";
import { getPropertyById } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(Number(id));
  return {
    title: property ? `Modifier — ${property.title}` : "Modifier l'annonce",
    robots: { index: false, follow: false },
  };
}

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/mon-compte");

  const { id } = await params;
  const property = await getPropertyById(Number(id));

  if (!property) {
    return (
      <div className="container-x pt-40 pb-24 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-900">
          Annonce introuvable
        </h1>
        <p className="mt-2 text-brand-500">
          Cette annonce n&apos;existe plus ou a été supprimée.
        </p>
        <Link href="/admin" className="btn btn-primary mt-6">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-sand-100 pt-36 pb-20">
      <div className="container-x max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 transition-colors hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>

        <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-brand-900">
            <Pencil className="h-6 w-6 text-gold-500" />
            Modifier l&apos;annonce
          </h1>
          <p className="mt-1 text-sm text-brand-500">{property.title}</p>

          <div className="mt-6">
            <PropertyForm property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}

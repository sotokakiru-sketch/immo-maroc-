import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  ArrowLeft,
  Phone,
  Calendar,
  CheckCircle2,
  Tag,
  MessageCircle,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { formatPrice, formatPriceEuro, AGENCY } from "@/lib/constants";
import { getPropertyById, getRelatedProperties } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(Number(id));
  if (!property) return { title: "Bien introuvable" };
  return {
    title: property.title,
    description: property.description.slice(0, 150),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(Number(id));

  if (!property) notFound();

  const related = await getRelatedProperties(property.id, property.type, 3);
  const location = property.district
    ? `${property.district}, ${property.city}`
    : property.city;

  const features = [
    { icon: BedDouble, label: "Chambres", value: property.bedrooms },
    { icon: Bath, label: "Salles de bain", value: property.bathrooms },
    { icon: Maximize, label: "Surface", value: `${property.area} m²` },
  ];

  const highlights = [
    "Vue dégagée et luminosité exceptionnelle",
    "Finitions et matériaux haut de gamme",
    "Stationnement et sécurité 24h/24",
    "Quartier prisé et bien desservi",
  ];

  return (
    <article>
      {/* Image héro */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-brand-950/30" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-10">
          <Link
            href="/biens"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-gold-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">
              {property.type}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                property.status === "Vente"
                  ? "bg-gold-500 text-brand-950"
                  : "bg-white text-brand-800"
              }`}
            >
              {property.status === "Vente" ? "À vendre" : "À louer"}
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-white drop-shadow sm:text-4xl lg:text-5xl">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sand-100">
            <MapPin className="h-4 w-4 text-gold-400" />
            {location}
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          {/* Colonne principale */}
          <div>
            <div className="grid grid-cols-3 gap-4">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-sand-200 bg-white p-5 text-center shadow-soft"
                >
                  <f.icon className="mx-auto h-6 w-6 text-gold-500" />
                  <p className="mt-2 font-display text-xl font-bold text-brand-900">
                    {f.value}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-brand-400">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-brand-900">
                Description
              </h2>
              <p className="mt-4 leading-relaxed text-brand-700">
                {property.description}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-brand-900">
                Points forts
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-brand-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Carte de contact (sticky) */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-sand-200 bg-white p-7 shadow-luxe">
              <p className="text-sm uppercase tracking-wide text-brand-400">
                {property.status === "Vente" ? "Prix de vente" : "Loyer mensuel"}
              </p>
              <p className="mt-1 font-display text-4xl font-bold text-brand-900">
                {formatPrice(property.price)}
                {property.status === "Location" && (
                  <span className="text-lg font-medium text-brand-500">
                    {" "}
                    / mois
                  </span>
                )}
              </p>
              {property.status === "Vente" && (
                <p className="mt-1 text-sm font-medium text-brand-500">
                  {formatPriceEuro(property.price)}
                </p>
              )}

              <div className="mt-6 space-y-3 border-t border-sand-200 pt-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-brand-500">Type</span>
                  <span className="font-medium text-brand-900">
                    {property.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-500">Quartier</span>
                  <span className="font-medium text-brand-900">
                    {property.district ?? property.city}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-500">Réf.</span>
                  <span className="font-medium text-brand-900">
                    DF-{String(property.id).padStart(4, "0")}
                  </span>
                </div>
              </div>

              <a href={`tel:${AGENCY.phoneTel}`} className="btn btn-primary mt-6 w-full">
                <Phone className="h-4 w-4" />
                Appeler {AGENCY.phoneDisplay}
              </a>
              <a
                href={AGENCY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold mt-3 w-full"
              >
                <MessageCircle className="h-4 w-4" />
                Contacter sur WhatsApp
              </a>
              <a href={`mailto:${AGENCY.email}`} className="btn btn-ghost mt-3 w-full">
                <Calendar className="h-4 w-4" />
                Demander une visite
              </a>

              <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-brand-400">
                <Tag className="h-3.5 w-3.5" />
                Réponse sous 24h ouvrées
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Biens similaires */}
      {related.length > 0 && (
        <section className="bg-sand-100 py-16">
          <div className="container-x">
            <h2 className="font-display text-2xl font-bold text-brand-900">
              Biens similaires
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

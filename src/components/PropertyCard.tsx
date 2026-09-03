import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize, MapPin, ArrowRight } from "lucide-react";
import type { Property } from "@/db/schema";
import { formatPrice, formatPriceEuro } from "@/lib/constants";

export default function PropertyCard({ property }: { property: Property }) {
  const location = property.district
    ? `${property.district}, ${property.city}`
    : property.city;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-sand-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-luxe">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/5 to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-brand-700/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {property.type}
          </span>
        </div>
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
            property.status === "Vente"
              ? "bg-gold-500 text-brand-950"
              : "bg-white/90 text-brand-800"
          }`}
        >
          {property.status === "Vente" ? "À vendre" : "À louer"}
        </span>

        {/* Prix */}
        <div className="absolute bottom-3 left-3">
          <p className="font-display text-xl font-bold text-white drop-shadow">
            {formatPrice(property.price)}
            {property.status === "Location" && (
              <span className="text-sm font-medium text-sand-100"> /mois</span>
            )}
          </p>
          {property.status === "Vente" && (
            <p className="text-xs font-medium text-sand-100/90 drop-shadow">
              {formatPriceEuro(property.price)}
            </p>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-brand-900 line-clamp-1">
          {property.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-500">
          <MapPin className="h-4 w-4 shrink-0 text-gold-500" />
          {location}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-brand-700/80 line-clamp-2">
          {property.description}
        </p>

        {/* Caractéristiques */}
        <div className="mt-4 flex items-center gap-4 border-t border-sand-200 pt-4 text-sm text-brand-700">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-brand-400" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-brand-400" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-brand-400" />
            {property.area} m²
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/biens/${property.id}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-gold-600"
        >
          Voir les détails
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

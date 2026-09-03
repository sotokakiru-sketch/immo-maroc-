import type { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { searchProperties } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tous nos biens",
  description:
    "Parcourez l'intégralité de notre catalogue de biens immobiliers d'exception au Maroc.",
};

export default async function BiensPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = {
    city: typeof sp.city === "string" ? sp.city : undefined,
    district: typeof sp.district === "string" ? sp.district : undefined,
    type: typeof sp.type === "string" ? sp.type : undefined,
    maxPrice: typeof sp.maxPrice === "string" ? sp.maxPrice : undefined,
    status: typeof sp.status === "string" ? sp.status : undefined,
  };

  const results = await searchProperties(filters);
  const hasFilters = Boolean(
    filters.city ||
      filters.district ||
      filters.type ||
      filters.maxPrice ||
      filters.status,
  );

  return (
    <>
      {/* En-tête */}
      <section className="bg-brand-900 pt-32 pb-44 text-white">
        <div className="container-x">
          <span className="eyebrow text-gold-400">Notre catalogue</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Trouvez votre bien à Tanger
          </h1>
          <p className="mt-3 max-w-xl text-sand-200">
            Filtrez par type, quartier et budget pour affiner votre recherche
            parmi nos biens à Tanger et dans la Médina.
          </p>
        </div>
      </section>

      {/* Barre de filtres flottante */}
      <div className="container-x -mt-24">
        <SearchBar defaults={filters} />
      </div>

      {/* Résultats */}
      <section className="py-16">
        <div className="container-x">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-brand-600">
              <span className="font-semibold text-brand-900">
                {results.length}
              </span>{" "}
              bien{results.length > 1 ? "s" : ""} trouvé
              {results.length > 1 ? "s" : ""}
              {hasFilters ? " pour votre recherche" : ""}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand-300 bg-white py-20 text-center">
              <p className="font-display text-2xl font-semibold text-brand-900">
                {hasFilters
                  ? "Aucun bien ne correspond"
                  : "Aucune annonce disponible pour le moment"}
              </p>
              <p className="mt-2 text-brand-600">
                {hasFilters
                  ? "Essayez d'élargir vos critères de recherche."
                  : "Notre équipe prépare actuellement de nouvelles parutions à Tanger."}
              </p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

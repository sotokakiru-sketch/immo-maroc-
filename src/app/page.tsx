import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Gem,
  Handshake,
  MapPinned,
  ArrowRight,
  Phone,
  Inbox,
} from "lucide-react";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import Testimonials from "@/components/Testimonials";
import { getFeaturedProperties } from "@/lib/data";
import { AGENCY } from "@/lib/constants";

export const dynamic = "force-dynamic";

const SERVICES = [
  {
    icon: Gem,
    title: "Sélection locale",
    text: "Chaque bien est visité et certifié par nos équipes. Nous connaissons Tanger et sa Médina sur le bout des doigts.",
  },
  {
    icon: Handshake,
    title: "Accompagnement complet",
    text: "De la première visite à la signature, un conseiller dédié vous guide à chaque étape de votre projet.",
  },
  {
    icon: ShieldCheck,
    title: "Transactions sécurisées",
    text: "Cadre juridique rigoureux et transparence totale pour acheter, vendre ou louer en toute sérénité.",
  },
  {
    icon: MapPinned,
    title: "Expertise du terrain",
    text: "Une connaissance fine des quartiers de Tanger pour estimer juste et dénicher les meilleures opportunités.",
  },
];

const QUARTIERS = [
  {
    name: "Médina",
    image:
      "https://images.pexels.com/photos/11344766/pexels-photo-11344766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700",
  },
  {
    name: "Malabata",
    image:
      "https://images.pexels.com/photos/8134745/pexels-photo-8134745.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700",
  },
  {
    name: "California",
    image:
      "https://images.pexels.com/photos/8082328/pexels-photo-8082328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700",
  },
  {
    name: "Marshan",
    image:
      "https://images.pexels.com/photos/25254859/pexels-photo-25254859.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProperties(6);

  return (
    <>
      <Hero />

      {/* Biens à la une */}
      <section id="biens" className="bg-sand-50 py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <div className="max-w-xl">
              <span className="eyebrow">
                <span className="h-px w-8 bg-gold-500" />
                Sélection du moment
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
                Nos biens à la une à Tanger
              </h2>
              <p className="mt-3 text-brand-600">
                Riads de la Médina, appartements vue mer et villas de prestige :
                découvrez nos coups de cœur du moment.
              </p>
            </div>
            <Link
              href="/biens"
              className="group inline-flex items-center gap-2 font-semibold text-brand-700 transition-colors hover:text-gold-600"
            >
              Voir tout le catalogue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-sand-300 bg-white px-6 py-16 text-center">
              <Inbox className="h-12 w-12 text-brand-300" />
              <h3 className="mt-4 font-display text-xl font-bold text-brand-900">
                Aucune annonce disponible pour le moment
              </h3>
              <p className="mt-2 max-w-md text-brand-500">
                Notre équipe sélectionne actuellement de nouveaux biens à
                Tanger. Revenez bientôt ou contactez-nous pour une recherche
                personnalisée.
              </p>
              <a href={`tel:${AGENCY.phoneTel}`} className="btn btn-primary mt-6">
                <Phone className="h-4 w-4" />
                {AGENCY.phoneDisplay}
              </a>
            </div>
          ) : (
            <div className="mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Témoignages Google */}
      <Testimonials />

      {/* Services */}
      <section className="bg-brand-950 py-20 text-white lg:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center text-gold-400">
              <span className="h-px w-8 bg-gold-500" />
              Notre différence
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              L&apos;excellence immobilière, dans les moindres détails
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-gold-500/50 hover:bg-white/[0.07]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-brand-950 transition-transform group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-300">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quartiers de Tanger */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold-500" />
              Nos quartiers
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Explorer Tanger, quartier par quartier
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUARTIERS.map((c) => (
              <Link
                key={c.name}
                href={`/biens?district=${encodeURIComponent(c.name)}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={c.image}
                  alt={`Quartier ${c.name} à Tanger`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl font-bold text-white">
                    {c.name}
                  </h3>
                  <p className="flex items-center gap-1.5 text-sm text-sand-200">
                    <MapPinned className="h-3.5 w-3.5 text-gold-400" />
                    Tanger
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bandeau CTA */}
      <section className="pb-24">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-brand-800 px-8 py-14 text-center sm:px-16 lg:py-20">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
                Prêt à trouver votre bien à Tanger ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sand-200">
                Appelez-nous ou écrivez-nous sur WhatsApp : nos conseillers vous
                répondent et préparent une sélection sur-mesure.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href={`tel:${AGENCY.phoneTel}`} className="btn btn-gold">
                  <Phone className="h-4 w-4" />
                  {AGENCY.phoneDisplay}
                </a>
                <Link
                  href="/biens"
                  className="btn btn-ghost border-white/30 text-white hover:bg-white/10"
                >
                  Explorer les biens
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

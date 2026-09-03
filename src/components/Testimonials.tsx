import { Star, Quote } from "lucide-react";
import { AGENCY } from "@/lib/constants";

interface Review {
  name: string;
  initials: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Per Can",
    initials: "PC",
    text: "Un immense merci à Hamza pour son professionnalisme et sa sympathie durant toutes les étapes de notre achat d'appartement à Tanger. Une grande disponibilité & de très bons conseils.",
  },
  {
    name: "Alexandre Flinois",
    initials: "AF",
    text: "Superbe agence immobilière dans le quartier de la Médina, pas loin du centre de Tanger… Rigoureux et à l’écoute.",
  },
  {
    name: "Achraf Gnouni",
    initials: "AG",
    text: "Une excellente agence. Réactivité, professionnalisme, gentillesse. Immo Maroc nous accompagne vraiment avec une vraie écoute.",
  },
];

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.6 30.4 0 24 0 14.6 0 6.4 5.4 2.6 13.3l7.9 6.2C12.2 13.7 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.2-3.9 6.7-9.6 6.7-17z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.5c-.5-1.5-.8-3-.8-4.5s.3-3.1.8-4.5l-7.9-6.2C1 16.5 0 20.1 0 24s1 7.5 2.6 10.7l7.9-6.2z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.4 0 11.8-2.1 15.7-5.7l-7.1-5.5c-2 1.3-4.5 2.1-8.6 2.1-6.4 0-11.8-4.2-13.5-9.9l-7.9 6.2C6.4 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-sand-100 py-20 lg:py-28">
      <div className="container-x">
        {/* En-tête + résumé Google */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <span className="eyebrow justify-center">
              <span className="h-px w-8 bg-gold-500" />
              Avis clients
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              La confiance de nos clients, notre meilleure vitrine
            </h2>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-sand-200 bg-white px-8 py-5 shadow-soft sm:flex-row sm:gap-4">
            <GoogleG className="h-9 w-9" />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                <span className="font-display text-2xl font-bold text-brand-900">
                  {AGENCY.rating.toFixed(1)}
                </span>
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-gold-400 text-gold-400"
                    />
                  ))}
                </span>
              </div>
              <p className="text-sm text-brand-500">
                Note Google · {AGENCY.reviewsCount} avis vérifiés
              </p>
            </div>
          </div>
        </div>

        {/* Cartes d'avis */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="relative flex flex-col rounded-2xl border border-sand-200 bg-white p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-sand-200" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-700">
                « {r.text} »
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-sand-200 pt-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-gold-400">
                  {r.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-900">
                    {r.name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-brand-400">
                    <GoogleG className="h-3 w-3" />
                    Avis Google · 5/5
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

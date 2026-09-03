import { ChevronDown, Star, MapPin } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { HERO_VIDEO_URL, HERO_POSTER_URL, AGENCY } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Vidéo de fond — Cap Spartel, Tanger */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={HERO_POSTER_URL}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>

      {/* Overlays de lisibilité */}
      <div className="absolute inset-0 bg-brand-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-950/30 to-brand-950/85" />

      {/* Contenu */}
      <div className="container-x relative z-10 w-full pt-28 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow animate-fade-in justify-center text-gold-400">
            <MapPin className="h-3.5 w-3.5" />
            {AGENCY.city} · Médina &amp; environs
          </span>

          <h1 className="mt-5 animate-fade-up font-display text-4xl font-bold leading-[1.1] text-white drop-shadow-lg sm:text-5xl lg:text-[3.4rem]">
            Immo Maroc
            <span className="block text-gold-400">
              Votre partenaire immobilier à Tanger
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-sand-100/90 [animation-delay:120ms]">
            Appartements en Médina, riads de charme et villas de prestige. Nous
            vous accompagnons pour acheter, vendre ou louer dans les plus beaux
            quartiers de Tanger.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mx-auto mt-10 max-w-4xl animate-fade-up [animation-delay:220ms]">
          <SearchBar />
        </div>

        {/* Statistiques / preuve sociale */}
        <div className="mx-auto mt-10 flex max-w-2xl animate-fade-in flex-wrap items-center justify-center gap-x-10 gap-y-4 [animation-delay:320ms]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 font-display text-2xl font-bold text-white">
              {AGENCY.rating.toFixed(1)}
              <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
            </div>
            <p className="text-xs uppercase tracking-wider text-sand-200/80">
              Note Google
            </p>
          </div>
          {[
            { value: `${AGENCY.reviewsCount}`, label: "Avis vérifiés" },
            { value: "Tanger", label: "Médina & environs" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-bold text-white">
                {s.value}
              </p>
              <p className="text-xs uppercase tracking-wider text-sand-200/80">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateur de scroll */}
      <a
        href="#biens"
        aria-label="Faire défiler"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </a>
    </section>
  );
}

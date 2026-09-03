import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Navigation, Star } from "lucide-react";
import { AGENCY } from "@/lib/constants";
import Logo from "@/components/Logo";

const SOCIALS = [
  {
    label: "Facebook",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z",
  },
  {
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 1.8a3.18 3.18 0 1 0 0 6.36 3.18 3.18 0 0 0 0-6.36Zm5.18-.92a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0Z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-sand-100">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.2fr_1.5fr]">
          {/* Brand */}
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-sand-300">
              Votre agence immobilière de confiance à Tanger. Achat, vente et
              location de biens d&apos;exception dans la Médina et ses environs.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
              <span className="text-sm">
                <span className="font-semibold text-white">
                  {AGENCY.rating.toFixed(1)}
                </span>
                <span className="text-sand-300">
                  {" "}
                  · {AGENCY.reviewsCount} avis Google
                </span>
              </span>
            </div>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-sand-200 transition-colors hover:bg-gold-500 hover:text-brand-950"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white">
              Navigation
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { href: "/", label: "Accueil" },
                { href: "/biens", label: "Tous les biens" },
                { href: "/a-propos", label: "À propos" },
                { href: "/login", label: "Mon compte" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sand-300 transition-colors hover:text-gold-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-4 text-sm text-sand-300">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>
                  {AGENCY.address}
                  <br />
                  {AGENCY.city} {AGENCY.postalCode}
                  <br />
                  <span className="text-sand-400">Plus Code : {AGENCY.plusCode}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <a
                  href={`tel:${AGENCY.phoneTel}`}
                  className="font-medium text-white hover:text-gold-400"
                >
                  {AGENCY.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <a
                  href={`mailto:${AGENCY.email}`}
                  className="hover:text-gold-400"
                >
                  {AGENCY.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>{AGENCY.hours}</span>
              </li>
            </ul>
          </div>

          {/* Carte Google Maps */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white">
              Nous trouver
            </h4>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Localisation Immo Maroc — Tanger"
                src={AGENCY.mapsEmbed}
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={AGENCY.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold mt-3 w-full"
            >
              <Navigation className="h-4 w-4" />
              Itinéraire Google Maps
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-sand-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {AGENCY.name} — {AGENCY.city}. Tous
            droits réservés.
          </p>
          <p>{AGENCY.addressFull}</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, MapPin, Star, LogIn, User } from "lucide-react";
import { AGENCY } from "@/lib/constants";
import { logoutAction } from "@/lib/auth-actions";
import type { SessionUser } from "@/lib/auth";
import Logo from "@/components/Logo";
import AccountMenu from "@/components/AccountMenu";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/biens", label: "Nos biens" },
  { href: "/a-propos", label: "À propos" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.042v-.001zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export default function Header({ session }: { session: SessionUser | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = scrolled || !isHome;
  const loggedIn = Boolean(session);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Barre supérieure — contact & note Google */}
      <div className="hidden bg-brand-950 text-sand-300 md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <a
            href={AGENCY.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-gold-400"
          >
            <MapPin className="h-3.5 w-3.5 text-gold-500" />
            {AGENCY.addressFull} · {AGENCY.quarter}
          </a>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-gold-400">
                {AGENCY.rating.toFixed(1)}
              </span>
              <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
              <span className="text-sand-400">
                Note Google · {AGENCY.reviewsCount} avis
              </span>
            </span>
            <a
              href={AGENCY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-gold-400"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-gold-500" />
              WhatsApp
            </a>
            <a
              href={`tel:${AGENCY.phoneTel}`}
              className="flex items-center gap-1.5 font-medium text-white transition-colors hover:text-gold-400"
            >
              <Phone className="h-3.5 w-3.5 text-gold-500" />
              {AGENCY.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Barre de navigation principale */}
      <div
        className={`transition-all duration-300 ${
          solid ? "bg-sand-50/90 shadow-soft backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between">
          <Logo variant={solid ? "color" : "light"} />

          {/* Nav desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                  solid ? "text-brand-800" : "text-white/90"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA desktop — connexion ou compte */}
          <div className="hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <>
                <Link
                  href="/mon-compte"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold-500 ${
                    solid ? "text-brand-800" : "text-white/90"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Mon compte
                </Link>
                <AccountMenu session={session!} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-gold-500 ${
                    solid ? "text-brand-800" : "text-white/90"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Se connecter
                </Link>
                <Link href="/biens" className="btn btn-gold">
                  Nos biens
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
            className={`grid h-11 w-11 place-items-center rounded-xl transition-colors md:hidden ${
              solid
                ? "bg-brand-50 text-brand-800"
                : "bg-white/15 text-white backdrop-blur"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overlay menu mobile */}
      <div
        className={`fixed inset-0 z-50 bg-brand-950/98 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between">
          <Logo variant="light" />
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="container-x mt-6 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 font-display text-2xl text-white transition-colors hover:text-gold-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="container-x mt-8 flex flex-col gap-3">
          {/* Connexion / compte (mobile) */}
          {loggedIn ? (
            <>
              <Link
                href="/mon-compte"
                onClick={() => setOpen(false)}
                className="btn btn-gold w-full"
              >
                <User className="h-4 w-4" />
                Mon compte
              </Link>
              {session!.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="btn btn-gold w-full"
                >
                  Espace admin
                </Link>
              )}
              <form action={logoutAction}>
                <button type="submit" className="btn btn-ghost w-full border-white/30 text-white">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn btn-gold w-full"
              >
                <LogIn className="h-4 w-4" />
                Se connecter
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="btn btn-ghost w-full border-white/30 text-white"
              >
                Créer un compte
              </Link>
            </>
          )}
          <a href={`tel:${AGENCY.phoneTel}`} className="mt-2 flex items-center justify-center gap-2 text-sm text-sand-300">
            <Phone className="h-4 w-4 text-gold-500" />
            {AGENCY.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}

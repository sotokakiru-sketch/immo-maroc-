"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, User, LogOut, LayoutGrid, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";
import type { SessionUser } from "@/lib/auth";

/** Avatar + menu déroulant du compte connecté (desktop). */
export default function AccountMenu({ session }: { session: SessionUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = session.email.slice(0, 2).toUpperCase();

  // Ferme le menu au clic extérieur.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-2 py-1.5 text-sm font-medium transition-colors ${
          open
            ? "border-brand-300 bg-brand-50"
            : "border-sand-200 bg-white hover:border-brand-300"
        }`}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-700 text-xs font-bold text-gold-400">
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate text-brand-800 lg:block">
          {session.email}
        </span>
        <ChevronDown className="h-4 w-4 text-brand-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-luxe">
          <div className="border-b border-sand-200 px-4 py-3">
            <p className="flex items-center gap-1.5 text-xs text-brand-400">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
              {session.role === "admin" ? "Administrateur" : "Client"}
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-brand-900">
              {session.email}
            </p>
          </div>
          <nav className="py-1">
            <Link
              href="/mon-compte"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-700 transition-colors hover:bg-brand-50"
            >
              <User className="h-4 w-4 text-brand-400" />
              Mon compte
            </Link>
            {session.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-700 transition-colors hover:bg-brand-50"
              >
                <LayoutGrid className="h-4 w-4 text-brand-400" />
                Espace admin
              </Link>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </form>
          </nav>
        </div>
      )}
    </div>
  );
}

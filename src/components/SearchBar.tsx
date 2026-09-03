"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search, MapPin, Home, Wallet } from "lucide-react";
import { QUARTIERS, PROPERTY_TYPES } from "@/lib/constants";

interface SearchBarProps {
  defaults?: {
    status?: string;
    type?: string;
    district?: string;
    maxPrice?: string;
  };
}

export default function SearchBar({ defaults = {} }: SearchBarProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"Vente" | "Location">(
    defaults.status === "Location" ? "Location" : "Vente",
  );
  const [type, setType] = useState(defaults.type ?? "Tous");
  const [district, setDistrict] = useState(defaults.district ?? "Tous");
  const [maxPrice, setMaxPrice] = useState(defaults.maxPrice ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    // Le statut est toujours envoyé pour filtrer "Acheter" (Vente) vs "Louer" (Location).
    params.set("status", status);
    if (type !== "Tous") params.set("type", type);
    if (district !== "Tous") params.set("district", district);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/biens?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-white/40 bg-white/95 p-3 shadow-luxe backdrop-blur-xl sm:p-4"
    >
      {/* Toggle Vente / Location */}
      <div className="mb-3 inline-flex rounded-full bg-sand-100 p-1">
        {(["Vente", "Location"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all ${
              status === s
                ? "bg-brand-700 text-white shadow-soft"
                : "text-brand-600 hover:text-brand-800"
            }`}
          >
            {s === "Vente" ? "Acheter" : "Louer"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_auto]">
        {/* Type */}
        <label className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white px-3.5 py-2.5 focus-within:border-brand-400">
          <Home className="h-5 w-5 shrink-0 text-gold-500" />
          <span className="flex flex-1 flex-col">
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-400">
              Type de bien
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="-ml-0.5 bg-transparent text-sm font-medium text-brand-900 focus:outline-none"
            >
              <option value="Tous">Tous les types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </span>
        </label>

        {/* Quartier */}
        <label className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white px-3.5 py-2.5 focus-within:border-brand-400">
          <MapPin className="h-5 w-5 shrink-0 text-gold-500" />
          <span className="flex flex-1 flex-col">
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-400">
              Quartier à Tanger
            </span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="-ml-0.5 bg-transparent text-sm font-medium text-brand-900 focus:outline-none"
            >
              <option value="Tous">Tous les quartiers</option>
              {QUARTIERS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </span>
        </label>

        {/* Budget */}
        <label className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white px-3.5 py-2.5 focus-within:border-brand-400">
          <Wallet className="h-5 w-5 shrink-0 text-gold-500" />
          <span className="flex flex-1 flex-col">
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-400">
              Budget max (DH)
            </span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Ex : 3 000 000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="-ml-0.5 w-full bg-transparent text-sm font-medium text-brand-900 placeholder:text-brand-300 focus:outline-none"
            />
          </span>
        </label>

        {/* Bouton */}
        <button type="submit" className="btn btn-primary h-full px-7">
          <Search className="h-5 w-5" />
          Rechercher
        </button>
      </div>
    </form>
  );
}

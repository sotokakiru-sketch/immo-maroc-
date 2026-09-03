"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  Pencil,
  Plus,
} from "lucide-react";
import {
  createProperty,
  updateProperty,
  type FormState,
} from "@/lib/actions";
import { PROPERTY_TYPES, QUARTIERS } from "@/lib/constants";
import type { Property } from "@/db/schema";
import { useToast } from "@/components/Toast";

function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{children}</p>;
}

interface PropertyFormProps {
  /** Si fournie, le formulaire passe en mode « modification ». */
  property?: Property;
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const editing = Boolean(property);
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    editing ? updateProperty : createProperty,
    null,
  );
  const { toast } = useToast();
  const [resetKey, setResetKey] = useState(0);
  const [lastHandled, setLastHandled] = useState<string | null>(null);

  // Affiche un toast à chaque retour de server action.
  useEffect(() => {
    if (!state?.message || state.message === lastHandled) return;
    setLastHandled(state.message);

    if (state.ok) {
      toast("success", state.message, 4000);
      // Réinitialise le formulaire après 2 secondes.
      const timer = setTimeout(() => setResetKey((k) => k + 1), 2000);
      return () => clearTimeout(timer);
    } else {
      toast("error", state.message, 6000);
    }
  }, [state, toast, lastHandled]);

  const errors = state?.errors;
  const v = state?.values;

  return (
    <form key={resetKey} action={formAction} className="space-y-6">
      {editing && (
        <input type="hidden" name="id" value={property!.id} />
      )}

      {/* Message global */}
      {state?.message && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            state.ok
              ? "border-brand-200 bg-brand-50 text-brand-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Titre */}
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="title">
            Titre du bien *
          </label>
          <input
            id="title"
            name="title"
            defaultValue={v?.title ?? property?.title}
            className="field-input"
            placeholder="Ex : Appartement vue mer — Malabata"
          />
          <FieldError>{errors?.title}</FieldError>
        </div>

        {/* Type */}
        <div>
          <label className="field-label" htmlFor="type">
            Type de bien *
          </label>
          <select
            id="type"
            name="type"
            defaultValue={v?.type ?? property?.type ?? "Appartement"}
            className="field-input"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError>{errors?.type}</FieldError>
        </div>

        {/* Statut */}
        <div>
          <label className="field-label" htmlFor="status">
            Transaction *
          </label>
          <select
            id="status"
            name="status"
            defaultValue={v?.status ?? property?.status ?? "Vente"}
            className="field-input"
          >
            <option value="Vente">Vente</option>
            <option value="Location">Location</option>
          </select>
          <FieldError>{errors?.status}</FieldError>
        </div>

        {/* Prix */}
        <div>
          <label className="field-label" htmlFor="price">
            Prix (DH) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="1000"
            defaultValue={v?.price ?? property?.price}
            className="field-input"
            placeholder="Ex : 2 450 000"
          />
          <FieldError>{errors?.price}</FieldError>
        </div>

        {/* Surface */}
        <div>
          <label className="field-label" htmlFor="area">
            Surface (m²) *
          </label>
          <input
            id="area"
            name="area"
            type="number"
            min={0}
            defaultValue={v?.area ?? property?.area}
            className="field-input"
            placeholder="Ex : 145"
          />
          <FieldError>{errors?.area}</FieldError>
        </div>

        {/* Quartier */}
        <div>
          <label className="field-label" htmlFor="district">
            Quartier à Tanger *
          </label>
          <select
            id="district"
            name="district"
            defaultValue={v?.district ?? property?.district ?? QUARTIERS[0]}
            className="field-input"
          >
            {QUARTIERS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <FieldError>{errors?.district}</FieldError>
        </div>

        {/* Ville fixée à Tanger */}
        <input type="hidden" name="city" value="Tanger" />

        {/* Chambres */}
        <div>
          <label className="field-label" htmlFor="bedrooms">
            Chambres *
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={v?.bedrooms ?? property?.bedrooms ?? "0"}
            className="field-input"
            placeholder="Ex : 3"
          />
          <FieldError>{errors?.bedrooms}</FieldError>
        </div>

        {/* Salles de bain */}
        <div>
          <label className="field-label" htmlFor="bathrooms">
            Salles de bain *
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={v?.bathrooms ?? property?.bathrooms ?? "0"}
            className="field-input"
            placeholder="Ex : 2"
          />
          <FieldError>{errors?.bathrooms}</FieldError>
        </div>

        {/* Image */}
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="imageUrl">
            URL de la photo principale *
          </label>
          <div className="relative">
            <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300" />
            <input
              id="imageUrl"
              name="imageUrl"
              defaultValue={v?.imageUrl ?? property?.imageUrl}
              className="field-input pl-11"
              placeholder="https://…"
            />
          </div>
          <FieldError>{errors?.imageUrl}</FieldError>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={v?.description ?? property?.description}
            className="field-input resize-none"
            placeholder="Décrivez les atouts du bien : architecture, prestations, environnement…"
          />
          <FieldError>{errors?.description}</FieldError>
        </div>

        {/* Mis en avant */}
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-sand-200 bg-white p-4">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={v ? v.featured === "on" : property?.featured}
              className="h-5 w-5 accent-brand-700"
            />
            <span className="text-sm font-medium text-brand-800">
              Mettre ce bien en avant sur la page d&apos;accueil
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-sand-200 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {editing ? "Enregistrement…" : "Publication…"}
            </>
          ) : editing ? (
            <>
              <Pencil className="h-4 w-4" />
              Enregistrer les modifications
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Publier l&apos;annonce
            </>
          )}
        </button>
        <p className="text-xs text-brand-400">
          {editing
            ? "Les modifications seront visibles immédiatement."
            : "La nouvelle annonce apparaîtra immédiatement sur le site."}
        </p>
      </div>
    </form>
  );
}

"use server";

import { db } from "@/db";
import { properties } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import type { PropertyType } from "@/db/schema";
import { PROPERTY_TYPES } from "@/lib/constants";
import { getSession } from "@/lib/session";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const OK_TYPES = new Set<string>(PROPERTY_TYPES);

/**
 * Barrière de sécurité : toute mutation exige une session admin valide.
 * Complète la protection du middleware (qui ne voit que la présence du cookie).
 */
async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Accès non autorisé : vous devez être connecté.");
  }
  if (session.role !== "admin") {
    throw new Error("Accès réservé à l'administrateur.");
  }
  return session;
}

/** Extrait et normalise les champs du formulaire. */
function parseInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    city: String(formData.get("city") ?? "Tanger").trim(),
    district: String(formData.get("district") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    type: String(formData.get("type") ?? "Appartement"),
    status: String(formData.get("status") ?? "Vente"),
    bedrooms: String(formData.get("bedrooms") ?? "0"),
    bathrooms: String(formData.get("bathrooms") ?? "0"),
    area: String(formData.get("area") ?? "0"),
    featured: String(formData.get("featured") ?? "off"),
  };
}

/** Valide les champs extraits et renvoie erreurs + valeurs typées. */
function validateInput(raw: ReturnType<typeof parseInput>) {
  const errors: Record<string, string> = {};
  if (!raw.title) errors.title = "Le titre est obligatoire.";
  if (!raw.district) errors.district = "Le quartier est obligatoire.";
  if (!raw.description) errors.description = "La description est obligatoire.";

  const priceNum = Number(raw.price);
  if (!raw.price || Number.isNaN(priceNum) || priceNum <= 0)
    errors.price = "Indiquez un prix valide (supérieur à 0).";

  if (!raw.imageUrl) errors.imageUrl = "L'URL de l'image est obligatoire.";
  else if (!/^(\/api\/images\/\d+|https?:\/\/)/i.test(raw.imageUrl))
    errors.imageUrl = "L'URL doit être une photo stockée (/api/images/…) ou commencer par http(s)://";

  if (!OK_TYPES.has(raw.type)) errors.type = "Type de bien invalide.";
  if (raw.status !== "Vente" && raw.status !== "Location")
    errors.status = "Statut invalide.";

  const bedrooms = Number(raw.bedrooms);
  const bathrooms = Number(raw.bathrooms);
  const area = Number(raw.area);
  if (Number.isNaN(bedrooms) || bedrooms < 0)
    errors.bedrooms = "Nombre de chambres invalide.";
  if (Number.isNaN(bathrooms) || bathrooms < 0)
    errors.bathrooms = "Nombre de salles de bain invalide.";
  if (Number.isNaN(area) || area <= 0) errors.area = "Surface invalide (m²).";

  return { errors, bedrooms, bathrooms, area, priceNum };
}

/** Crée une nouvelle annonce (admin uniquement). */
export async function createProperty(
  _prev: FormState | null,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const raw = parseInput(formData);
  const { errors, bedrooms, bathrooms, area, priceNum } = validateInput(raw);

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Veuillez corriger les champs en rouge.",
      errors,
      values: raw,
    };
  }

  try {
    await db.insert(properties).values({
      title: raw.title,
      description: raw.description,
      price: priceNum.toFixed(2),
      city: raw.city || "Tanger",
      district: raw.district,
      imageUrl: raw.imageUrl,
      type: raw.type as PropertyType,
      status: raw.status as "Vente" | "Location",
      bedrooms,
      bathrooms,
      area,
      featured: raw.featured === "on",
    });

    revalidatePath("/");
    revalidatePath("/biens");
    revalidatePath("/biens/[id]");
    revalidatePath("/admin");

    return { ok: true, message: `« ${raw.title} » a été publiée avec succès.` };
  } catch (err) {
    console.error("createProperty error:", err);
    return {
      ok: false,
      message: "Une erreur est survenue lors de l'enregistrement.",
      values: raw,
    };
  }
}

/** Modifie une annonce existante (admin uniquement). */
export async function updateProperty(
  _prev: FormState | null,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (Number.isNaN(id)) {
    return { ok: false, message: "Identifiant d'annonce invalide." };
  }

  const raw = parseInput(formData);
  const { errors, bedrooms, bathrooms, area, priceNum } = validateInput(raw);

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Veuillez corriger les champs en rouge.",
      errors,
      values: raw,
    };
  }

  // Une image de type /api/images/… provient de la couverture calculée :
  // on la conserve telle quelle en base (aucune écriture superflue).
  const isStoredCover = /^\/api\/images\/\d+$/.test(raw.imageUrl);

  try {
    const result = await db
      .update(properties)
      .set({
        title: raw.title,
        description: raw.description,
        price: priceNum.toFixed(2),
        city: raw.city || "Tanger",
        district: raw.district,
        ...(isStoredCover ? {} : { imageUrl: raw.imageUrl }),
        type: raw.type as PropertyType,
        status: raw.status as "Vente" | "Location",
        bedrooms,
        bathrooms,
        area,
        featured: raw.featured === "on",
      })
      .where(eq(properties.id, id));

    if (result.rowCount === 0) {
      return { ok: false, message: "Annonce introuvable." };
    }

    revalidatePath("/");
    revalidatePath("/biens");
    revalidatePath("/biens/[id]");
    revalidatePath("/admin");

    return { ok: true, message: `« ${raw.title} » a été mise à jour.` };
  } catch (err) {
    console.error("updateProperty error:", err);
    return {
      ok: false,
      message: "Une erreur est survenue lors de la modification.",
      values: raw,
    };
  }
}

/** Supprime une annonce (admin uniquement). */
export async function deleteProperty(id: number) {
  await requireAdmin();
  await db.delete(properties).where(eq(properties.id, id));
  revalidatePath("/");
  revalidatePath("/biens");
  revalidatePath("/admin");
  redirect("/admin");
}

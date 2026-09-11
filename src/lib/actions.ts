"use server";

import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import type { PropertyType } from "@/db/schema";
import { PROPERTY_TYPES } from "@/lib/constants";
import { getSession } from "@/lib/session";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  /** Erreur globale du bloc photos, affichée par l'ImageUploader. */
  imageErrors?: string;
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

/**
 * Photos : sélectionnées sur l'appareil (galerie ou fichiers) puis compressées
 * côté client par l'ImageUploader (data URL base64). Elles sont enregistrées
 * dans la table property_images — le stockage existant des photos, servi
 * ensuite via /api/images/:id. Aucune photo existante n'est modifiée ni
 * supprimée.
 */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 Mo après compression côté client
const MAX_IMAGES = 10;

/** Extrait les photos envoyées (dataURL base64) et valide chacune. */
function parseImages(formData: FormData): {
  images: string[];
  error?: string;
} {
  const raw = formData.getAll("images[]");
  const images: string[] = [];
  for (const entry of raw) {
    if (typeof entry !== "string" || !entry) continue;
    if (!/^data:image\/(jpeg|jpg|png|webp);base64,/.test(entry)) {
      return {
        images: [],
        error: "Format d'image invalide (JPEG/PNG/WebP attendu).",
      };
    }
    // Estimation de la taille : le base64 pèse ~4/3 de la taille binaire.
    const estimatedBytes = Math.round((entry.length * 3) / 4);
    if (estimatedBytes > MAX_IMAGE_BYTES) {
      return {
        images: [],
        error: "Une photo dépasse 5 Mo après compression.",
      };
    }
    images.push(entry);
  }
  if (images.length > MAX_IMAGES) {
    return {
      images: [],
      error: `Maximum ${MAX_IMAGES} photos par annonce.`,
    };
  }
  return { images };
}

/** Extrait et normalise les champs du formulaire. */
function parseInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    city: String(formData.get("city") ?? "Tanger").trim(),
    district: String(formData.get("district") ?? "").trim(),
    type: String(formData.get("type") ?? "Appartement"),
    status: String(formData.get("status") ?? "Vente"),
    bedrooms: String(formData.get("bedrooms") ?? "0"),
    bathrooms: String(formData.get("bathrooms") ?? "0"),
    area: String(formData.get("area") ?? "0"),
    featured: String(formData.get("featured") ?? "off"),
  };
}

/** Valide les champs extraits et renvoie erreurs + valeurs numériques. */
function validateInput(raw: ReturnType<typeof parseInput>) {
  const errors: Record<string, string> = {};
  if (!raw.title) errors.title = "Le titre est obligatoire.";
  if (!raw.district) errors.district = "Le quartier est obligatoire.";
  if (!raw.description) errors.description = "La description est obligatoire.";

  const priceNum = Number(raw.price);
  if (!raw.price || Number.isNaN(priceNum) || priceNum <= 0)
    errors.price = "Indiquez un prix valide (supérieur à 0).";

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

/** Insère les photos d'une annonce (position 0 = couverture). */
async function insertImages(propertyId: number, images: string[]) {
  if (images.length === 0) return;
  const values = images.map((data, i) => ({ propertyId, position: i, data }));
  await db.insert(propertyImages).values(values);
}

/**
 * Ajoute uniquement les photos pas encore enregistrées (mode édition) : les
 * photos existantes sont conservées telles quelles — aucune suppression, aucun
 * décalage de position. Si la galerie est inchangée, aucune écriture.
 */
async function appendNewImages(propertyId: number, images: string[]) {
  if (images.length === 0) return;

  const existing = await db
    .select({ data: propertyImages.data })
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, propertyId));
  const existingSet = new Set(existing.map((r) => r.data));
  const fresh = images.filter((d) => !existingSet.has(d));
  if (fresh.length === 0) return;

  const [row] = await db
    .select({ max: sql<number>`coalesce(max(${propertyImages.position}), -1)` })
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, propertyId));
  const start = (row?.max ?? -1) + 1;
  const values = fresh.map((data, i) => ({
    propertyId,
    position: start + i,
    data,
  }));
  await db.insert(propertyImages).values(values);
}

/** Crée une nouvelle annonce (admin uniquement). */
export async function createProperty(
  _prev: FormState | null,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const raw = parseInput(formData);
  const { errors, bedrooms, bathrooms, area, priceNum } = validateInput(raw);
  const { images, error: imageError } = parseImages(formData);

  const photoError =
    !imageError && images.length === 0
      ? "Sélectionnez au moins une photo depuis votre appareil."
      : imageError;

  if (Object.keys(errors).length > 0 || photoError) {
    return {
      ok: false,
      message: "Veuillez corriger les champs en rouge.",
      errors,
      imageErrors: photoError,
      values: raw,
    };
  }

  try {
    const [created] = await db
      .insert(properties)
      .values({
        title: raw.title,
        description: raw.description,
        price: priceNum.toFixed(2),
        city: raw.city || "Tanger",
        district: raw.district,
        imageUrl: "",
        type: raw.type as PropertyType,
        status: raw.status as "Vente" | "Location",
        bedrooms,
        bathrooms,
        area,
        featured: raw.featured === "on",
      })
      .returning({ id: properties.id });

    await insertImages(created.id, images);

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
  const { images, error: imageError } = parseImages(formData);

  if (Object.keys(errors).length > 0 || imageError) {
    return {
      ok: false,
      message: "Veuillez corriger les champs en rouge.",
      errors,
      imageErrors: imageError,
      values: raw,
    };
  }

  // Sans nouvelle photo, image_url et les photos déjà enregistrées sont
  // conservées telles quelles.
  try {
    const result = await db
      .update(properties)
      .set({
        title: raw.title,
        description: raw.description,
        price: priceNum.toFixed(2),
        city: raw.city || "Tanger",
        district: raw.district,
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

    // Les photos existantes ne sont ni supprimées ni modifiées : seules les
    // nouvelles photos (jamais enregistrées) sont ajoutées à la galerie.
    await appendNewImages(id, images);

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

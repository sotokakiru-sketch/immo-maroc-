import { db } from "@/db";
import {
  properties,
  propertyImages,
  type Property,
  type PropertyType,
} from "@/db/schema";
import { and, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import { propertyImageUrl } from "@/lib/constants";

export interface SearchFilters {
  city?: string;
  district?: string;
  type?: string;
  maxPrice?: string;
  status?: string;
}

export type PropertyWithGallery = Property & { galleryImageIds: number[] };

/**
 * Rattache à chaque annonce la liste de ses photos stockées en base
 * (table property_images, jamais modifiée) et, quand image_url est vide,
 * utilise la première photo comme couverture. Lecture seule.
 */
async function attachGallery<T extends Property>(rows: T[]): Promise<(T & { galleryImageIds: number[] })[]> {
  const out = rows.map((r) => ({ ...r, galleryImageIds: [] as number[] }));
  const ids = [...new Set(rows.map((r) => r.id))];
  if (ids.length === 0) return out;

  let imgs: { propertyId: number; id: number }[] = [];
  try {
    imgs = await db
      .select({ propertyId: propertyImages.propertyId, id: propertyImages.id })
      .from(propertyImages)
      .where(inArray(propertyImages.propertyId, ids))
      .orderBy(propertyImages.propertyId, propertyImages.position);
  } catch (err) {
    console.error("[Immo Maroc] attachGallery — lecture property_images :", err);
  }

  const byProperty = new Map<number, number[]>();
  for (const im of imgs) {
    const list = byProperty.get(im.propertyId) ?? [];
    list.push(im.id);
    byProperty.set(im.propertyId, list);
  }

  for (const row of out) {
    const gallery = byProperty.get(row.id) ?? [];
    row.galleryImageIds = gallery;
    if ((!row.imageUrl || !row.imageUrl.trim()) && gallery.length > 0) {
      row.imageUrl = propertyImageUrl(gallery[0]);
    }
  }
  return out;
}

/**
 * Toutes les annonces, du plus récent au plus ancien.
 * Aucune donnée factice : renvoie une liste vide si la base est vide.
 * En cas d'erreur (base injoignable, schéma absent), loggue et renvoie [].
 */
export async function getAllProperties(): Promise<PropertyWithGallery[]> {
  try {
    const rows = await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));
    return attachGallery(rows);
  } catch (err) {
    console.error(
      "[DarFind] getAllProperties — échec de lecture de la base :",
      err,
    );
    return [];
  }
}

/** Annonces mises en avant (page d'accueil). */
export async function getFeaturedProperties(
  limit = 6,
): Promise<PropertyWithGallery[]> {
  try {
    const rows = await db
      .select()
      .from(properties)
      .where(eq(properties.featured, true))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
    return attachGallery(rows);
  } catch (err) {
    console.error(
      "[DarFind] getFeaturedProperties — échec de lecture de la base :",
      err,
    );
    return [];
  }
}

/**
 * Une annonce par son identifiant.
 * Renvoie null si introuvable OU en cas d'erreur de lecture.
 */
export async function getPropertyById(
  id: number,
): Promise<PropertyWithGallery | null> {
  try {
    const [row] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    if (!row) return null;
    return (await attachGallery([row]))[0];
  } catch (err) {
    console.error(
      "[DarFind] getPropertyById — échec de lecture de la base :",
      err,
    );
    return null;
  }
}

/** Annonces similaires (même type), hors bien courant. */
export async function getRelatedProperties(
  id: number,
  type: PropertyType,
  limit = 3,
): Promise<PropertyWithGallery[]> {
  try {
    const rows = await db
      .select()
      .from(properties)
      .where(and(eq(properties.type, type), sql`${properties.id} <> ${id}`))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
    return attachGallery(rows);
  } catch (err) {
    console.error(
      "[DarFind] getRelatedProperties — échec de lecture de la base :",
      err,
    );
    return [];
  }
}

/** Recherche filtrée par quartier / type / budget / statut. */
export async function searchProperties(filters: SearchFilters) {
  const conditions: SQL[] = [];

  if (filters.city && filters.city !== "Toutes") {
    conditions.push(eq(properties.city, filters.city));
  }
  if (filters.district && filters.district !== "Tous") {
    conditions.push(eq(properties.district, filters.district));
  }
  if (filters.type && filters.type !== "Tous") {
    conditions.push(eq(properties.type, filters.type as PropertyType));
  }
  if (filters.status && filters.status !== "Tous") {
    conditions.push(eq(properties.status, filters.status as "Vente" | "Location"));
  }
  if (filters.maxPrice && !Number.isNaN(Number(filters.maxPrice))) {
    conditions.push(sql`${properties.price} <= ${Number(filters.maxPrice)}`);
  }

  try {
    const rows = await db
      .select()
      .from(properties)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(properties.createdAt));
    return attachGallery(rows);
  } catch (err) {
    console.error(
      "[DarFind] searchProperties — échec de lecture de la base :",
      err,
    );
    return [];
  }
}

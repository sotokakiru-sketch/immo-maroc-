import { db } from "@/db";
import { properties, type PropertyType } from "@/db/schema";
import { and, desc, eq, sql, type SQL } from "drizzle-orm";

export interface SearchFilters {
  city?: string;
  district?: string;
  type?: string;
  maxPrice?: string;
  status?: string;
}

/**
 * Toutes les annonces, du plus récent au plus ancien.
 * Aucune donnée factice : renvoie une liste vide si la base est vide.
 * En cas d'erreur (base injoignable, schéma absent), loggue et renvoie [].
 */
export async function getAllProperties() {
  try {
    return await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));
  } catch (err) {
    console.error(
      "[DarFind] getAllProperties — échec de lecture de la base :",
      err,
    );
    return [];
  }
}

/** Annonces mises en avant (page d'accueil). */
export async function getFeaturedProperties(limit = 6) {
  try {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.featured, true))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
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
export async function getPropertyById(id: number) {
  try {
    const [row] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return row ?? null;
  } catch (err) {
    console.error(
      "[DarFind] getPropertyById — échec de lecture de la base :",
      err,
    );
    return null;
  }
}

/** Annonces similaires (même type), hors bien courant. */
export async function getRelatedProperties(id: number, type: PropertyType, limit = 3) {
  try {
    return await db
      .select()
      .from(properties)
      .where(and(eq(properties.type, type), sql`${properties.id} <> ${id}`))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
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
    return await db
      .select()
      .from(properties)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(properties.createdAt));
  } catch (err) {
    console.error(
      "[DarFind] searchProperties — échec de lecture de la base :",
      err,
    );
    return [];
  }
}

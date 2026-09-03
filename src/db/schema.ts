import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  city: text("city").notNull(),
  district: text("district"),
  imageUrl: text("image_url").notNull(),
  type: text("type").$type<PropertyType>().notNull().default("Villa"),
  status: text("status").$type<"Vente" | "Location">().notNull().default("Vente"),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  area: integer("area").notNull().default(0), // surface en m²
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyType =
  | "Villa"
  | "Appartement"
  | "Riad"
  | "Penthouse"
  | "Studio"
  | "Terrain"
  | "Maison";

/**
 * Comptes administrateurs (espace /admin).
 * Les mots de passe sont stockés hachés (scrypt) — jamais en clair.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<"admin" | "client">().notNull().default("client"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Photos des annonces, telles qu'elles existent en base (aucune donnée
 * n'a été modifiée/supprimée). Chaque ligne stocke une photo encodée en
 * base64 (data URL) ; la couche applicative les expose via /api/images/:id
 * et utilise la position 0 comme visuel de couverture quand image_url est vide.
 */
export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  position: integer("position").notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PropertyImage = typeof propertyImages.$inferSelect;

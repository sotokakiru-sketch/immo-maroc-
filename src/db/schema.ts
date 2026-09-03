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

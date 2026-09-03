import type { PropertyType } from "@/db/schema";

/** Types de biens proposés par Immo Maroc (focus Tanger). */
export const PROPERTY_TYPES: PropertyType[] = [
  "Appartement",
  "Villa",
  "Riad",
  "Penthouse",
  "Studio",
  "Terrain",
  "Maison",
];

/** Quartiers de Tanger couverts par l'agence. */
export const QUARTIERS = [
  "Médina",
  "Malabata",
  "California",
  "Marshan",
  "Iberia",
  "Centre-ville",
  "Beni Makada",
  "Sococco",
  "Al Kasbah",
];

/** Coordonnées & informations réelles de l'agence Immo Maroc. */
export const AGENCY = {
  name: "Immo Maroc",
  tagline: "Votre partenaire immobilier de confiance à Tanger",
  phoneDisplay: "06 06 06 06 43",
  phoneTel: "+212606060643",
  whatsapp: "https://wa.me/212606060643",
  address: "17/19 Rue Jnan Kaptan",
  addressFull: "17/19 Rue Jnan Kaptan, Tanger 90000",
  quarter: "Quartier Médina",
  city: "Tanger",
  postalCode: "90000",
  rating: 5.0,
  reviewsCount: 30,
  plusCode: "Q5QQ+34 Tanger",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Q5QQ%2B34%20Tanger",
  mapsEmbed: "https://www.google.com/maps?q=Q5QQ%2B34+Tanger&output=embed",
  email: "contact@immomaroc.ma",
  hours: "Lun – Sam · 9h00 – 19h00",
} as const;

/** Taux de change indicatif MAD → EUR (pour l'affichage dual DH/€). */
export const EUR_RATE = 10.8;

/**
 * URL publique d'une photo stockée en base (table property_images).
 * La route /api/images/[id] décode le JPEG sans rien modifier.
 */
export function propertyImageUrl(imageId: number): string {
  return `/api/images/${imageId}`;
}

/** Vidéo de fond : phare du Cap Spartel à Tanger. */
export const HERO_VIDEO_URL =
  "https://videos.pexels.com/video-files/34726243/14720615_3840_2160_60fps.mp4";

/** Poster affiché instantanément avant le chargement de la vidéo. */
export const HERO_POSTER_URL =
  "https://images.pexels.com/videos/34726243/africa-maroc-morocco-mororcco-34726243.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600";

/** Formate un prix en dirhams : « 6 500 000 DH ». */
export function formatPrice(price: number | string): string {
  const n = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(n)) return "—";
  return `${new Intl.NumberFormat("fr-FR").format(n)} DH`;
}

/** Conversion indicative en euros : « ≈ 601 852 € ». */
export function formatPriceEuro(price: number | string): string {
  const n = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(n)) return "—";
  const eur = n / EUR_RATE;
  return `≈ ${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(eur)} €`;
}

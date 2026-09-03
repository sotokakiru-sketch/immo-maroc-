import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { propertyImages } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Sert une photo d'annonce stockée en base (table property_images).
 * Lecture seule : aucune écriture, aucune modification du stockage.
 * Le JPEG est décodé depuis la data URL puis renvoyé avec son type MIME.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const imageId = Number(id);
  if (!Number.isInteger(imageId) || imageId <= 0) {
    return new NextResponse("Requête invalide.", { status: 400 });
  }

  let rows: { data: string }[] = [];
  try {
    rows = await db
      .select({ data: propertyImages.data })
      .from(propertyImages)
      .where(eq(propertyImages.id, imageId))
      .limit(1);
  } catch (err) {
    console.error("[Immo Maroc] api/images — échec de lecture :", err);
    return new NextResponse("Erreur de lecture.", { status: 500 });
  }

  const row = rows[0];
  if (!row) {
    return new NextResponse("Photo introuvable.", { status: 404 });
  }

  const match = /^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(
    row.data,
  );
  if (!match) {
    return new NextResponse("Données d'image invalides.", { status: 415 });
  }

  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": match[1],
      "Content-Length": String(bytes.length),
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

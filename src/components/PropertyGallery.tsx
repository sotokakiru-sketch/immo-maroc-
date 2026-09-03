"use client";

import Image from "next/image";
import { useState } from "react";
import { propertyImageUrl } from "@/lib/constants";

/**
 * Galerie photos d'une annonce : grande image + vignettes cliquables.
 * Les photos sont servies par /api/images/:id (stockées en base, jamais
 * modifiées). Si aucune photo n'est stockée, on retombe sur image_url.
 */
export default function PropertyGallery({
  imageIds,
  fallbackSrc,
  title,
}: {
  imageIds: number[];
  fallbackSrc?: string | null;
  title: string;
}) {
  const urls =
    imageIds.length > 0
      ? imageIds.map((id) => propertyImageUrl(id))
      : fallbackSrc && fallbackSrc.trim()
        ? [fallbackSrc]
        : [];

  const [selected, setSelected] = useState(0);
  if (urls.length === 0) return null;

  const current = Math.min(selected, urls.length - 1);

  return (
    <>
      {/* Grande image */}
      <Image
        src={urls[current]}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Vignettes */}
      {urls.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex max-w-[80%] gap-2 overflow-x-auto rounded-xl bg-brand-950/30 p-2 backdrop-blur-sm">
          {urls.map((url, i) => (
            <button
              key={url}
              type="button"
              aria-label={`Photo ${i + 1} sur ${urls.length}`}
              onClick={() => setSelected(i)}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${
                i === current
                  ? "ring-2 ring-gold-400"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

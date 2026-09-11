"use client";

import { useCallback, useId, useRef, useState } from "react";
import NextImage from "next/image";
import { Upload, X, GripVertical, AlertCircle, Loader2 } from "lucide-react";

/**
 * Représentation interne d'une photo dans l'uploader.
 * - id : identifiant local unique (pour les clés React).
 * - data : dataURL base64 complète ("data:image/jpeg;base64,…").
 * - name : nom du fichier (pour l'UX, non envoyé).
 * - status : état du traitement (processing → ready → error).
 * - error : message d'erreur éventuel (ex: "Photo trop lourde (6,2 Mo)").
 */
export type DraftImage = {
  id: string;
  data: string;
  name: string;
  status: "processing" | "ready" | "error";
  error?: string;
};

/** Contraintes de compression côté client. */
const MAX_LONG_SIDE = 1600;
const JPEG_QUALITY = 0.82;
const MAX_BYTES_PER_IMAGE = 5 * 1024 * 1024; // 5 Mo
const MAX_IMAGES = 10;

/**
 * Formats acceptés : JPG/JPEG (même type MIME image/jpeg), PNG et WEBP.
 * L'attribut accept couvre PC ; le filtre par extension sert de repli pour
 * les navigateurs mobiles qui ne renseignent pas toujours le type MIME.
 */
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_EXT = /\.(jpe?g|png|webp)$/i;
const ACCEPT_ATTR = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

function isAcceptedImage(file: File): boolean {
  return ACCEPTED_MIME.includes(file.type) || ACCEPTED_EXT.test(file.name);
}

/** Redimensionne + compresse un File en dataURL base64 (JPEG). */
async function compressImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Lecture impossible"));
    i.src = dataUrl;
  });

  // Si l'image est déjà petite, on peut la renvoyer en JPEG direct.
  const longSide = Math.max(img.width, img.height);
  const scale = longSide > MAX_LONG_SIDE ? MAX_LONG_SIDE / longSide : 1;
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");
  ctx.drawImage(img, 0, 0, w, h);

  // Qualité JPEG progressive : on baisse la qualité si > 5 Mo.
  let quality = JPEG_QUALITY;
  let result = "";
  for (let i = 0; i < 4; i++) {
    result = canvas.toDataURL("image/jpeg", quality);
    const size = Math.round((result.length * 3) / 4); // estimation bytes base64
    if (size <= MAX_BYTES_PER_IMAGE || quality <= 0.5) break;
    quality -= 0.1;
  }
  return result;
}

function bytesToMb(n: number): string {
  return (n / (1024 * 1024)).toFixed(1);
}

interface ImageUploaderProps {
  /** Images déjà enregistrées en base (mode édition). */
  initialImages?: string[];
  /** Nom du champ FormData (par défaut "images[]"). */
  fieldName?: string;
  /** Messages d'erreur éventuels venant de la server action. */
  serverError?: string;
}

export default function ImageUploader({
  initialImages = [],
  fieldName = "images[]",
  serverError,
}: ImageUploaderProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const [images, setImages] = useState<DraftImage[]>(() =>
    initialImages.map((data, i) => ({
      id: `init-${i}-${Math.random().toString(36).slice(2, 8)}`,
      data,
      name: `Photo ${i + 1}`,
      status: "ready",
    })),
  );
  const [dragOver, setDragOver] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const slots = MAX_IMAGES - images.length;
    if (slots <= 0) return;

    const candidates = Array.from(files);
    const accepted = candidates.filter(isAcceptedImage);
    setRejectedCount(candidates.length - accepted.length);

    const list = accepted.slice(0, slots);
    if (list.length === 0) return;

    const drafts: DraftImage[] = list.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      data: "",
      name: f.name,
      status: "processing",
    }));
    setImages((prev) => [...prev, ...drafts]);

    // Compression asynchrone, une par une pour ne pas bloquer l'UI.
    for (let i = 0; i < list.length; i++) {
      const draft = drafts[i];
      try {
        const data = await compressImage(list[i]);
        const size = Math.round((data.length * 3) / 4);
        if (size > MAX_BYTES_PER_IMAGE) {
          setImages((prev) =>
            prev.map((p) =>
              p.id === draft.id
                ? {
                    ...p,
                    status: "error",
                    error: `Photo trop lourde (${bytesToMb(size)} Mo, max 5 Mo)`,
                  }
                : p,
            ),
          );
        } else {
          setImages((prev) =>
            prev.map((p) =>
              p.id === draft.id ? { ...p, data, status: "ready" } : p,
            ),
          );
        }
      } catch {
        setImages((prev) =>
          prev.map((p) =>
            p.id === draft.id
              ? { ...p, status: "error", error: "Compression impossible" }
              : p,
          ),
        );
      }
    }
  }, [images.length]);

  const remove = (targetId: string) =>
    setImages((prev) => prev.filter((p) => p.id !== targetId));

  // Drag & drop HTML5 pour réordonner les miniatures.
  const onDragStart = (i: number) => {
    dragItem.current = i;
  };
  const onDragEnter = (i: number) => {
    dragOverItem.current = i;
  };
  const onDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Drop fichiers externes sur la zone
  const onDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  // Ne pas inclure les images en erreur dans les champs envoyés.
  const readyImages = images.filter((p) => p.status === "ready" && p.data);

  return (
    <div className="space-y-3">
      <label className="field-label">
        Photos {readyImages.length > 0 && `(${readyImages.length}/${MAX_IMAGES})`}
      </label>

      {/* Zone de drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDropFiles}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? "border-brand-500 bg-brand-50"
            : "border-sand-300 bg-white hover:border-brand-300 hover:bg-brand-50/40"
        }`}
      >
        <Upload className="h-8 w-8 text-brand-400" />
        <p className="text-sm font-semibold text-brand-800">
          Glissez vos photos ici
        </p>
        <p className="text-xs text-brand-500">
          ou ouvrez la galerie de votre téléphone · JPG, JPEG, PNG, WEBP · max
          5 Mo / photo
        </p>
        <button
          type="button"
          onClick={(e) => {
            // stopPropagation : le conteneur est aussi cliquable, on évite
            // d'ouvrir deux fois le sélecteur de fichiers.
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="btn btn-primary mt-1"
        >
          <Upload className="h-4 w-4" />
          Choisir un fichier
        </button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            // permet de resélectionner le même fichier.
            e.target.value = "";
          }}
        />
      </div>

      {/* Aperçus */}
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((p, i) => (
            <li
              key={p.id}
              draggable={p.status === "ready"}
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`relative overflow-hidden rounded-xl border ring-1 transition-shadow ${
                p.status === "error"
                  ? "border-red-300 ring-red-200"
                  : i === 0 && p.status === "ready"
                    ? "border-gold-500 ring-gold-400 shadow-soft"
                    : "border-sand-200 ring-sand-200"
              }`}
            >
              {i === 0 && p.status === "ready" && (
                <span className="absolute left-1 top-1 z-10 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-brand-950 shadow">
                  Couverture
                </span>
              )}
              <button
                type="button"
                aria-label="Supprimer"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(p.id);
                }}
                className="absolute right-1 top-1 z-10 grid h-7 w-7 place-items-center rounded-full bg-brand-950/70 text-white transition-colors hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-square bg-sand-100">
                {p.status === "processing" ? (
                  <div className="grid h-full w-full place-items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
                  </div>
                ) : p.status === "error" ? (
                  <div className="grid h-full w-full place-items-center p-3 text-center text-xs text-red-600">
                    <div>
                      <AlertCircle className="mx-auto mb-1 h-5 w-5" />
                      {p.error}
                    </div>
                  </div>
                ) : (
                  <NextImage
                    src={p.data}
                    alt={p.name}
                    fill
                    unoptimized
                    sizes="180px"
                    className="object-cover"
                  />
                )}
              </div>
              {p.status === "ready" && (
                <div className="flex items-center gap-1 border-t border-sand-200 bg-white px-2 py-1 text-[11px] text-brand-500">
                  <GripVertical className="h-3.5 w-3.5 cursor-grab" />
                  <span className="truncate">{p.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Champs cachés envoyés au serveur (un par image prête). */}
      {readyImages.map((p) => (
        <input key={p.id} type="hidden" name={fieldName} value={p.data} />
      ))}

      {/* Fichiers ignorés car au mauvais format. */}
      {rejectedCount > 0 && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-4 w-4" />
          {rejectedCount} fichier(s) ignoré(s) : formats acceptés JPG, JPEG,
          PNG, WEBP.
        </p>
      )}

      {/* Erreur serveur éventuelle (ex: "Au moins une photo est requise"). */}
      {serverError && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-4 w-4" />
          {serverError}
        </p>
      )}

      <p className="text-xs text-brand-400">
        La première photo (marquée <em>Couverture</em>) sera affichée dans les
        listes. Faites glisser pour réordonner.
      </p>
    </div>
  );
}

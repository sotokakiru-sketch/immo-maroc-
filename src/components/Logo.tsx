import Link from "next/link";
import Image from "next/image";

type LogoVariant = "color" | "light";

/**
 * Logo officiel Immo Maroc (PNG transparent).
 * - `color`  : version couleur (éméraude + or), pour les fonds clairs.
 * - `light`  : silhouette blanche (via filtre), pour les fonds sombres
 *              (hero vidéo, footer, menu mobile).
 * Le ratio est préservé (`h-12 w-auto object-contain`) : aucune déformation.
 */
export default function Logo({
  variant = "color",
  className = "",
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Immo Maroc — retour à l'accueil"
      className={`flex items-center ${className}`}
    >
      <Image
        src="/logo-immo-maroc.png"
        alt="Immo Maroc"
        width={180}
        height={80}
        className={`h-12 w-auto object-contain ${
          variant === "light" ? "brightness-0 invert" : ""
        }`}
        priority
      />
    </Link>
  );
}

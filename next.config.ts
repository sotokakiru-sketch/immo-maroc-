import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise tout hôte en HTTPS : les annonces peuvent référencer des
    // images hébergées sur n'importe quel service (Pexels, Unsplash, CDN…).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Les photos sélectionnées sur l'appareil sont envoyées via une Server
      // Action (encodage base64) : la limite par défaut de 1 Mo rejeterait
      // la plupart des photos. Alignée sur PHOTO_MAX_BYTES (4 Mo).
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;

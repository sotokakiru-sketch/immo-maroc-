import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise tout hôte en HTTPS : les annonces peuvent référencer des
    // images hébergées sur n'importe quel service (Pexels, Unsplash, CDN…).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Les photos sélectionnées sur l'appareil sont envoyées en base64 dans
      // le corps des Server Actions (jusqu'à 10 photos × ~5 Mo après
      // compression côté client). La limite par défaut de 1 Mo ferait échouer
      // la publication : on l'élève largement, comme dans la version d'origine.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;

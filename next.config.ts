import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise tout hôte en HTTPS : les annonces peuvent référencer des
    // images hébergées sur n'importe quel service (Pexels, Unsplash, CDN…).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

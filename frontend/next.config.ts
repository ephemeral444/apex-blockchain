import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prototipo SPA: sin caché de componentes (evita ruido del overlay dev).
  cacheComponents: false,
  partialPrefetching: false,
  // El SDK de Stellar se usa tal cual en el servidor (API routes), sin bundling.
  serverExternalPackages: ["@stellar/stellar-sdk"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prototipo SPA: sin caché de componentes (evita ruido del overlay dev).
  cacheComponents: false,
  partialPrefetching: false,
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

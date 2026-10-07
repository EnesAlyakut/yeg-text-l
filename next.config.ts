import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [75, 80, 85, 88, 90, 95],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    localPatterns: [{ pathname: "/media/**" }, { pathname: "/uploads/**" }],
  },
  compress: true,
  experimental: {
    optimizePackageImports: ["gsap", "framer-motion", "clsx", "lenis"],
    serverActions: { bodySizeLimit: "4mb" },
  },
  poweredByHeader: false,
  // Temporary share links (localhost.run SSH tunnel) to the dev server
  allowedDevOrigins: ["*.lhr.life", "*.localhost.run"],
  // Turkish alias for the About page; browsers carry the #section across the redirect.
  async redirects() {
    return [
      { source: "/hakkimizda", destination: "/tr/about", permanent: false },
      { source: "/tr/hakkimizda", destination: "/tr/about", permanent: false },
      { source: "/uretim", destination: "/tr/production", permanent: false },
      { source: "/tr/uretim", destination: "/tr/production", permanent: false },
      { source: "/kumaslar", destination: "/tr/fabrics", permanent: false },
      { source: "/tr/kumaslar", destination: "/tr/fabrics", permanent: false },
      { source: "/surdurulebilirlik", destination: "/tr/sustainability", permanent: false },
      { source: "/tr/surdurulebilirlik", destination: "/tr/sustainability", permanent: false },
    ];
  },
};

export default nextConfig;

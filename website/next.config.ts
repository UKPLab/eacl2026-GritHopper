import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/eacl2026-GritHopper",
  assetPrefix: "/eacl2026-GritHopper/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

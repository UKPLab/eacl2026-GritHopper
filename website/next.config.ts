import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/GritHopper",
  assetPrefix: "/GritHopper/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

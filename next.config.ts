import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No need for `serverActions: true`
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

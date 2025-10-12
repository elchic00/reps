import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Fix for Monaco Editor in Next.js
    config.resolve.fallback = {
      fs: false,
      path: false,
      module: false
    };
    return config;
  },
};

export default nextConfig;

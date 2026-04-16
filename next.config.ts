import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['@base-ui/react'],
  },
};

export default nextConfig;

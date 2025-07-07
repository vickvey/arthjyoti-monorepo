import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // When you call /api/anything
        destination: "http://localhost:5500/api/:path*", // It will proxy to your backend
      },
    ];
  },
};

export default nextConfig;

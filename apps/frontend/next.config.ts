import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5500/api/:path*", // Proxy to backend
      },
    ];
  },
};

export default nextConfig;

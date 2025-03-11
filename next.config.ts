import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*", // Applies to all API routes
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // Change "*" to specific domain if needed
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  /* config options here */
};

export default nextConfig;

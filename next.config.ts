import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ignoreBuildErrors: true, // 🚨 ปิด Type Checking ตอน Build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ]
  },
  devIndicators: {
    buildActivity: false
  }
};

export default nextConfig;

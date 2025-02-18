import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ignoreBuildErrors: true, // 🚨 ปิด Type Checking ตอน Build
  },
  images: {
    domains: ["res.cloudinary.com"],
  }
};

export default nextConfig;

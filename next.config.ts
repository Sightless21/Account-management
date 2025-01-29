import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // 🚨 ปิด Type Checking ตอน Build
  },
};

export default nextConfig;

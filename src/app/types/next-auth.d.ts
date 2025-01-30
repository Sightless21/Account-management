// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

// เพิ่มการขยาย Session และ User type
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // เพิ่ม id ที่นี่
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
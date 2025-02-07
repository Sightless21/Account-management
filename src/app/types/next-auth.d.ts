// src/types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultSession } from "next-auth";

// เพิ่มการขยาย Session และ User type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string | null;
      // ฟิลด์อื่นๆ ที่มีอยู่เดิม
    };
  }
}
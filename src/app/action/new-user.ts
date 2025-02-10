"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@/types/users";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export async function createUser(formData: FormData) {
  try {
    console.log("Received formData:", formData); // Debugging

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (existingUser) {
      return { success: false, message: "User already exists." };
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // สร้างผู้ใช้ใหม่
    await prisma.user.create({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        hashedPassword,
        phone: formData.phone,
        isVerify: false,
        role: formData.role as Role,
      },
    });

    return { success: true, message: "User created successfully." };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "An error occurred while creating the user." };
  }
}
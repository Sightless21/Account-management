"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

type Role = 'EMPLOYEE' | 'MANAGER' | 'HR' ; // Define the Role type

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmpassword: string;
  role: Role;
}

export async function createUser(formData: FormData) {
  console.log("Received formData:", formData); // Debugging
  const user = await prisma.user.findUnique({
    where: {
      email: formData.email,
    },
  });
  if (user) {
    return alert("User already exist please type again");
  } else {
    await prisma.user.create({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        hashedPassword: await bcrypt.hashSync(formData.password, 10),
        phone: formData.phone,
        isVerity: false,
        role: formData.role as Role,
      },
    });
  }
}

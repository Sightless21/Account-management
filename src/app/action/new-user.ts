"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@/types/users"

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

/**
 * Create a new user in the database.
 *
 * @param {FormData} formData - The form data, with the following properties:
 *   - firstName: The user's first name.
 *   - lastName: The user's last name.
 *   - email: The user's email.
 *   - phone: The user's phone number.
 *   - password: The user's password.
 *   - confirmPassword: The user's password confirmation.
 *   - role: The user's role, either 'EMPLOYEE', 'MANAGER', or 'HR'.
 *
 * @returns {void}
 *
 * @throws {Error} If the user already exists.
 */
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
        isVerify: false,
        role: formData.role as Role,
      },
    });
  }
}

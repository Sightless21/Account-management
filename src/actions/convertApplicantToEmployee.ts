"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

interface ConvertApplicantData {
  applicantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export async function convertApplicantToEmployee(data: ConvertApplicantData) {
  try {
    const { applicantId, password, confirmPassword, firstName, lastName, email, phone } = data;
    console.log("Received data:", data);

    // ตรวจสอบว่ารหัสผ่านตรงกัน
    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    // ดึงข้อมูล Applicant
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: { documents: true },
    });
    console.log("Applicant data:", applicant);

    if (!applicant) {
      return { success: false, message: "Applicant not found." };
    }

    // ตรวจสอบว่า Applicant ถูกแปลงไปแล้วหรือไม่
    if (applicant.convertedToEmployeeAt) {
      return { success: false, message: "Applicant has already been converted to an Employee." };
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return { success: false, message: "Email is already in use by another user." };
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // ใช้ Transaction เพื่อสร้าง User ก่อน แล้วค่อย Employee
    const result = await prisma.$transaction(async (tx) => {
      // สร้าง User ก่อน
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          hashedPassword,
          phone,
          role: "EMPLOYEE",
          isVerify: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log("User created:", user);

      // สร้าง Employee โดยเชื่อมโยงกับ User
      const employee = await tx.employee.create({
        data: {
          person: applicant.person,
          birthdate: applicant.birthdate,
          info: applicant.info,
          documents: { connect: applicant.documents.map((doc) => ({ id: doc.id })) },
          userId: user.id, // เชื่อมโยงกับ User ทันที
          createdAt: new Date(),
          updatedAt: new Date(),
          military: applicant.military || "", 
          marital: applicant.marital || "", 
          dwelling: applicant.dwelling || "", 
        },
      });
      console.log("Employee created:", employee);

      // อัปเดต User ด้วย employeeId
      await tx.user.update({
        where: { id: user.id },
        data: { employeeId: employee.id },
      });

      // อัปเดต Applicant
      await tx.applicant.update({
        where: { id: applicantId },
        data: { convertedToEmployeeAt: new Date(),
          status : "SUCCESS"
         },
      });

      // อัปเดต Document
      await tx.document.updateMany({
        where: { applicantId: applicantId },
        data: { applicantId: null, employeeId: employee.id },
      });

      return { employee, user };
    });

    console.log("Conversion result:", result);

    const user = await prisma.user.findUnique({
      where: { id: result.user.id },
    });

    console.log("User data:", user);

    return {
      success: true,
      message: "Applicant successfully converted to Employee.",
      data: { employeeId: result.employee.id, email: result.user.email },
    };
  } catch (error) {
    console.error("Error converting applicant to employee:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, message: "Email is already in use by another user." };
    }
    return { 
      success: false, 
      message: "An error occurred during conversion: " + (error instanceof Error ? error.message : "Unknown error") 
    };
  }
}
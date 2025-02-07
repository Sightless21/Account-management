import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";


//DONE : First Time Login endpoint 
const MIN_PASSWORD_LENGTH = 6;

export const POST = async (req: NextRequest) => {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ message: "Invalid Content-Type" }, { status: 400 });
    }

    const bodyText = await req.text();
    if (!bodyText) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    console.log("Received Body:", bodyText);

    const body = JSON.parse(bodyText);
    const { userId, newPassword, confirmPassword } = body;

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("Found User:", user);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ 1. อัปเดตรหัสผ่านของผู้ใช้
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword, isVerify: false },
    });

    console.log("Updated User:", userId);

    // ✅ 2. สร้าง Employee และตรวจสอบค่าที่ได้
    const createdEmployee = await prisma.employee.create({
      data: {
        userId: user.id,
        birthdate: new Date(),
        person: null,
        info: null,
        documents: { create: [] },
      },
    });

    console.log("Created Employee:", createdEmployee);

    if (!createdEmployee || !createdEmployee.id) {
      console.error("❌ Failed to create Employee!");
      return NextResponse.json({ message: "Failed to create Employee" }, { status: 500 });
    }

    // ✅ 3. อัปเดต employeeId ใน user
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isVerify: true,
        employeeId: createdEmployee.id
       },
    });

    console.log("Updated User:", userId);

    return NextResponse.json({ 
      status: "success",
      message: "User verified and employee created",
     }, { status: 200 });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

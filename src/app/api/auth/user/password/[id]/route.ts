import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params; // ไม่ต้อง await เพราะ params เป็น object อยู่แล้ว

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // ตรวจสอบว่ามีข้อมูลครบทุก field
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All password fields (currentPassword, newPassword, confirmPassword) are required" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ารหัสผ่านใหม่และยืนยันรหัสผ่านตรงกัน
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirm password must match" },
        { status: 400 }
      );
    }

    // ตรวจสอบความยาวรหัสผ่านใหม่
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // ค้นหาผู้ใช้
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { hashedPassword: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ตรวจสอบรหัสผ่านปัจจุบัน
    const isPasswordValid = bcrypt.compareSync(currentPassword, currentUser.hashedPassword || "");
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // เข้ารหัสรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { hashedPassword },
    });

    return NextResponse.json(
      { message: "Password updated successfully", user: { id: updatedUser.id } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
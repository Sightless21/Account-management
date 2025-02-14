import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const deletedCar = await prisma.car.delete({ where: { id } });
    return NextResponse.json(deletedCar, { status: 200 });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Error deleting car" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await req.json();
    console.log("📌 Received Body: ",data);
    // ตรวจสอบว่ามีรถที่ชื่อเดียวกันหรือไม่ (ตรวจสอบชื่อก่อน)
    let car = await prisma.car.findFirst({
      where: {
        plate: data.car.plate,  // ตรวจสอบชื่อรถ
      },
    });

    // ถ้าไม่มีรถในฐานข้อมูล, ให้สร้างรถใหม่
    if (!car) {
      car = await prisma.car.create({
        data: {
          name: data.car.name,
          plate: data.car.plate,
          type: data.car.type,
        },
      });
      console.log("✅ Created New Car:", car);
    } else {
      console.log("⚠️ Car with this name already exists:", car);
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        name: data.name,
        plate: data.plate,
        type: data.type,
      },
    });
    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Error updating car" },
      { status: 500 },
    );
  }
}
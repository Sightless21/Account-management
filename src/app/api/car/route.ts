import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const allCar = await prisma.car.findMany();
    return NextResponse.json(allCar, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Error fetching car" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("📌 Received Body:", body);

  // ตรวจสอบข้อมูลเบื้องต้น
  if (!body.name || !body.plate || !body.type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    // ตรวจสอบว่ามีรถที่ทะเบียนเดียวกันอยู่ในฐานข้อมูลหรือไม่
    const existingCar = await prisma.car.findUnique({
      where: { plate: body.plate },
    });

    if (existingCar) {
      return NextResponse.json({ error: "Car with this plate already exists" }, { status: 400 });
    }
    // สร้างรถใหม่
    const newCar = await prisma.car.create({
      data: {
        name: body.name,
        plate: body.plate,
        type: body.type,
      },
    });
    console.log("✅ Created New Car:", newCar);
    return NextResponse.json(newCar, { status: 200 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json(
      { error: "Error creating car" },
      { status: 500 },
    );
  }
}
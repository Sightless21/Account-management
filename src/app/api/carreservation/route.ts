import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const allCarReservation = await prisma.carReservation.findMany();
    return NextResponse.json(allCarReservation, { status: 200 });
  } catch (error) {
    console.error("Error fetching car reservation:", error);
    return NextResponse.json(
      { error: "Error fetching car reservation" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("📌 Received Body:", body);

  try {
    // ตรวจสอบว่ามีรถที่ชื่อเดียวกันหรือไม่ (ตรวจสอบชื่อก่อน)
    let car = await prisma.car.findFirst({
      where: {
        name: body.car.name,  // ตรวจสอบชื่อรถ
      },
    });

    // ถ้าไม่มีรถในฐานข้อมูล, ให้สร้างรถใหม่
    if (!car) {
      car = await prisma.car.create({
        data: {
          name: body.car.name,
          plate: body.car.plate,
          type: body.car.type,
        },
      });
      console.log("✅ Created New Car:", car);
    } else {
      console.log("⚠️ Car with this name already exists:", car);
    }

    // สร้างการจองรถ
    const newCarReservation = await prisma.carReservation.create({
      data: {
        userId: body.userId,
        employeeName: body.employeeName,
        date: new Date(body.date),
        destination: body.destination,
        startTime: body.startTime,
        endTime: body.endTime,
        status: body.status,
        carId: car.id, // ใช้ carId ที่สร้างหรือค้นพบ
        tripStatus: body.tripStatus,
      },
    });

    console.log("✅ Created Car Reservation:", newCarReservation);
    return NextResponse.json(newCarReservation, { status: 200 });
  } catch (error) {
    console.error("Error creating car reservation:", error);
    return NextResponse.json(
      { error: "Error creating car reservation" },
      { status: 500 }
    );
  }
}
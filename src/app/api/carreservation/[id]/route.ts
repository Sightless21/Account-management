import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const deletedCarReservation = await prisma.carReservation.delete({ where: { id } });
    return NextResponse.json(deletedCarReservation, { status: 200 });
  } catch (error) {
    console.error("Error deleting car reservation:", error);
    return NextResponse.json(
      { error: "Error deleting car reservation" },
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
        name: data.car.name,  // ตรวจสอบชื่อรถ
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

    const updatedCarReservation = await prisma.carReservation.update({
      where: { id },
      data: {
        employeeName: data.employeeName,
        date: new Date(data.date),
        destination: data.destination,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        carId : data.carID,
        tripStatus: data.tripStatus
      }
    });
    return NextResponse.json(updatedCarReservation, { status: 200 });
  } catch (error) {
    console.error("Error updating car reservation:", error);
    return NextResponse.json(
      { error: "Error updating car reservation" },
      { status: 500 },
    );
  }
}
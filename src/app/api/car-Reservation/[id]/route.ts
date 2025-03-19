/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const carReservation = await prisma.carReservation.findUnique({ 
      where: { id }, 
      include: { car: true }
    });
    return NextResponse.json(carReservation, { status: 200 });
  } catch (error) {
    console.error("Error fetching car reservation:", error);
    return NextResponse.json(
      { error: "Error fetching car reservation" },
      { status: 500 },
    );
  }
}

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
  if (!id) {
    return NextResponse.json({ error: "Missing reservation ID" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const startDate = new Date(data.date.from);
    const endDate = new Date(data.date.to);
    const startTime = data.startTime;
    const endTime = data.endTime;
    const normalizedPlate = data.car.plate.trim();

    const car = await prisma.car.findFirst({
      where: { plate: normalizedPlate },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // ตรวจสอบการจองที่ทับซ้อน (ไม่นับการจองตัวเอง) ด้วย raw query
    const overlappingReservationsRaw = await prisma.$runCommandRaw({
      find: "CarReservation",
      filter: {
        carId: car.id,
        _id: { $ne: id }, // ไม่นับการจองที่กำลังอัปเดต
        tripStatus: { $ne: "CANCELLED" },
        "date.from": { $lte: endDate.toISOString() },
        "date.to": { $gte: startDate.toISOString() },
      },
    });

    // แปลงผลลัพธ์จาก raw query เป็น array
    const overlappingReservations = (overlappingReservationsRaw as any)?.cursor?.firstBatch || [];


    // ตรวจสอบการทับซ้อนของเวลา
    const hasOverlap = overlappingReservations.some((reservation: any) => {
      const resStart = reservation.startTime;
      const resEnd = reservation.endTime;
      return startTime < resEnd && endTime > resStart;
    });

    if (hasOverlap) {
      return NextResponse.json(
        { error: "This car is already reserved for the selected date and time." },
        { status: 409 }
      );
    }

    // อัปเดตข้อมูล
    const updatedCarReservation = await prisma.carReservation.update({
      where: { id },
      data: {
        employeeName: data.employeeName,
        date: {
          from: startDate,
          to: endDate,
        },
        destination: data.destination,
        startTime: data.startTime,
        endTime: data.endTime,
        tripStatus: data.tripStatus,
        carId: car.id,
      },
    });

    return NextResponse.json(updatedCarReservation, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating car reservation:", error);
    return NextResponse.json({ error: "Error updating car reservation" }, { status: 500 });
  }
}
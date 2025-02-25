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
    console.log("📌 Received Body: ", data);

    // ตรวจสอบป้ายทะเบียนให้ไม่มีช่องว่างเกิน
    const normalizedPlate = data.car.plate.trim();

    const car = await prisma.car.findFirst({
      where: { plate: normalizedPlate },
    });

    if (!car) {
      return NextResponse.json({ error: "Car creation failed" }, { status: 500 });
    }

    // อัปเดตข้อมูล
    const updatedCarReservation = await prisma.carReservation.update({
      where: { id },
      data: {
        employeeName: data.employeeName,
        date: {
          from: new Date(data.date.from),
          to: new Date(data.date.to),
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
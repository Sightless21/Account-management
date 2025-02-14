import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const allCarReservation = await prisma.carReservation.findMany({
      include: {
        car: true,
      },
    });
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

    const car = await prisma.car.findFirst({
      where: {
        plate: body.car.plate.trim(),  
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car creation failed" }, { status: 500 });
    }

    const newCarReservation = await prisma.carReservation.create({
      data: {
        userId: body.userId,
        employeeName: body.employeeName,
        date: {
          from: new Date(body.date.from),
          to: new Date(body.date.to),
        },
        destination: body.destination,
        startTime: body.startTime,
        endTime: body.endTime,
        tripStatus: body.tripStatus,
        carId: car.id,
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
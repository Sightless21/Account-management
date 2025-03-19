/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { sendLineMessage } from '@/utils/line';
import { format } from 'date-fns';

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
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const startDate = new Date(body.date.from);
    const endDate = new Date(body.date.to);
    const startTime = body.startTime;
    const endTime = body.endTime;

    // ค้นหารถ
    const car = await prisma.car.findFirst({
      where: { plate: body.car.plate.trim() },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // ตรวจสอบการจองที่ทับซ้อนด้วย raw query
    const overlappingReservationsRaw = await prisma.$runCommandRaw({
      find: "CarReservation",
      filter: {
        carId: car.id,
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

    // ส่งข้อความ LINE
    const startDateFormatted = format(startDate, 'yyyy-MM-dd');
    const endDateFormatted = format(endDate, 'yyyy-MM-dd');
    const message =
      startDateFormatted === endDateFormatted
        ? `${car.plate} ถูกจองโดย คุณ ${body.employeeName} วันที่ ${startDateFormatted} ไปที่ ${body.destination}`
        : `${car.plate} ถูกจองโดย คุณ ${body.employeeName} จากวันที่ ${startDateFormatted} ถึงวันที่ ${endDateFormatted} ไปที่ ${body.destination}`;
    await sendLineMessage(message);

    // สร้าง Car Reservation
    const newCarReservation = await prisma.carReservation.create({
      data: {
        userId: body.userId,
        employeeName: body.employeeName,
        date: {
          from: startDate,
          to: endDate,
        },
        destination: body.destination,
        startTime: startTime,
        endTime: endTime,
        tripStatus: body.tripStatus || "ONGOING",
        carId: car.id,
      },
    });

    console.log("✅ Created Car Reservation:", newCarReservation);
    return NextResponse.json(
      { message: "✅ Created Car Reservation", data: newCarReservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating car reservation:", error);
    return NextResponse.json(
      { error: "Error creating car reservation" },
      { status: 500 }
    );
  }
}
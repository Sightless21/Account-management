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
    const startDate = format(body.date.from, 'yyyy-MM-dd');
    const endDate = format(body.date.to, 'yyyy-MM-dd');

    // ส่งข้อความ LINE ตามเงื่อนไข
    const message =
      startDate === endDate
        ? `${body.car.plate} ถูกจองโดย คุณ ${body.employeeName} วันที่ ${startDate} ไปที่ ${body.destination}`
        : `${body.car.plate} ถูกจองโดย คุณ ${body.employeeName} จากวันที่ ${startDate} ถึงวันที่ ${endDate} ไปที่ ${body.destination}`;
    
    await sendLineMessage(message);

    // ค้นหารถ
    const car = await prisma.car.findFirst({
      where: {
        plate: body.car.plate.trim(),
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // สร้าง Car Reservation
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
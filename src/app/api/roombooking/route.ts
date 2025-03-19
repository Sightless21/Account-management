import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const allRoomBooking = await prisma.roombooking.findMany();
    return NextResponse.json(allRoomBooking, { status: 200 });
  } catch (error) {
    console.error("Error fetching room booking:", error);
    return NextResponse.json(
      { error: "Error fetching room booking" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("📌 Received Body:", data);
    
    if (!data || !data.username || !data.startTime || !data.endTime || !data.date) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const newDate = new Date(data.date);
    const newStartTime = data.startTime;
    const newEndTime = data.endTime;

    // Check for overlapping bookings
    const overlappingBookings = await prisma.roombooking.findMany({
      where: {
        date: newDate,
        OR: [
          {
            AND: [
              { startTime: { lte: newEndTime } },
              { endTime: { gte: newStartTime } }
            ]
          }
        ]
      }
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { 
          error: "Booking conflict",
          message: "The requested time slot is already booked"
        },
        { status: 409 } // 409 Conflict
      );
    }

    const newRoomBooking = await prisma.roombooking.create({
      data: {
        username: data.username,
        startTime: newStartTime,
        endTime: newEndTime,
        date: newDate,
      },
    });
    
    return NextResponse.json(newRoomBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating room booking:", error);
    return NextResponse.json(
      { error: "Error creating room booking" },
      { status: 500 }
    );
  }
}

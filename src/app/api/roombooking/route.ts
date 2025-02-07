import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

//DONE : Room Booking endpoint (GET POST)
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
    if (!req.body) {
      console.error("❌ No payload received.");
      return NextResponse.json(
        { error: "No payload received" },
        { status: 400 },
      );
    }
    // ตรวจสอบว่า body มีค่าหรือไม่ และมี properties ที่ต้องการ
    if (!data || !data.username || !data.startTime || !data.endTime || !data.date) {
      throw new Error("Missing or invalid room or date");
    }

    const newRoomBooking = await prisma.roombooking.create({
      data: {
        username: data.username,
        startTime: data.startTime,
        endTime: data.endTime,
        date: new Date(data.date),
      },
    });
    return NextResponse.json(newRoomBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating room booking:", error);
    return NextResponse.json(
      { error: "Error creating room booking" },
      { status: 500 },
    );
  }
}

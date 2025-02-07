import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

//DONE : Room Booking endpoin (DELETE PATCH)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const deletedRoomBooking = await prisma.roombooking.delete({ where: { id } });
    return NextResponse.json(deletedRoomBooking, { status: 200 });
  } catch (error) {
    console.error("Error deleting room booking:", error);
    return NextResponse.json(
      { error: "Error deleting room booking" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await req.json();
    console.log("📌 Received Body: ",data);
    const updatedRoomBooking = await prisma.roombooking.update({
      where: { id },
      data: {
        username: data.username,
        startTime: data.startTime,
        endTime: data.endTime,
        date: new Date(data.date),
      }
    });
    return NextResponse.json(updatedRoomBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating room booking:", error);
    return NextResponse.json(
      { error: "Error updating room booking" },
      { status: 500 },
    );
  }
}
import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

//TODO : endpoont dayoff
export async function GET() {
  try {
    const allDayoff = await prisma.dayoff.findMany({
      select: {
        id: true,
        userId: true,
        employeeName: true,
        leaveType: true,
        date: true,
        status: true
      }
    });
    return NextResponse.json(allDayoff ?? [], { status: 200 }); // ✅ ถ้า null ให้คืน []
  } catch (error) {
    console.error("Error fetching dayoff:", error);
    return NextResponse.json(
      { error: "Error fetching dayoff" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("📌 Received Body:", body);
  try {
    const newLeave = await prisma.dayoff.create({
      data: {
        userId: body.userId,
        employeeName: body.employeeName,
        leaveType: body.leaveType,
        date: {
          from: new Date(body.date.from),
          to: new Date(body.date.to),
        },
        status: body.status || "Pending",
      },
    })
    console.log("✅ Created Leave:", newLeave)
    return NextResponse.json(newLeave, { status: 200 });
  } catch (error) {
    console.error("Error creating leave:", error);
    return NextResponse.json(
      { error: "Error creating leave" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  console.log("📌 Received Body:", body);

  try {
    const updatedLeave = await prisma.dayoff.update({
      where: { id: body.id }, // ตรวจสอบ id ที่ Prisma คาดหวัง
      data: { 
        status: body.status || "Pending" 
      },
    });

    console.log("✅ Updated Leave:", updatedLeave);
    return NextResponse.json(updatedLeave, { status: 200 });

  } catch (error) {
    console.error("❌ Error updating leave:", error);
    return NextResponse.json({ error: "Error updating leave" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  console.log("📌 Received Body:", body);
  try {
    const deletedLeave = await prisma.dayoff.delete({
      where: { id: body.id },
    });
    console.log("✅ Deleted Leave:", deletedLeave);
    return NextResponse.json(deletedLeave, { status: 200 });
  } catch (error) {
    console.error("Error deleting leave:", error);
    return NextResponse.json(
      { error: "Error deleting leave" },
      { status: 500 },
    );
  }
}
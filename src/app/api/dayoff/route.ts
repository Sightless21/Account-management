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
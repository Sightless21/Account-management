import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  console.log("📌 Received ID:", id);
  try {
    const body = await req.json();
    console.log("📌 Received Body:", body);
    const updatedLeave = await prisma.dayoff.update({
      where: { id },
      data: {
        employeeName: body.employeeName,
        leaveType: body.leaveType,
        date: {
          from: new Date(body.date.from),
          to: new Date(body.date.to),
        },
        status: body.status
      }
    });
    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    console.error("Error updating leave:", error);
    return NextResponse.json(
      { error: "Error updating leave" },
      { status: 500 },
    );
  }
}
import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

//TODO : endpoont dayoff
export async function GET() {
  try {
    const allLeave = await prisma.dayoff.findMany();
    
    if (!allLeave) {
      console.warn("No leave data found, returning empty array.");
      return NextResponse.json([], { status: 200 }); // ✅ ป้องกัน null
    }
    return NextResponse.json(allLeave, { status: 200 });
  } catch (error) {
    console.error("Error fetching leave:", error);
    return NextResponse.json(
      { error: "Error fetching leave" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const newLeave = await prisma.dayoff.create({ data: body });
    return NextResponse.json(newLeave, { status: 200 });
  } catch (error) {
    console.error("Error creating leave:", error);
    return NextResponse.json(
      { error: "Error creating leave" },
      { status: 500 },
    );
  }
}
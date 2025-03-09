import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: true,
        documents: true,
      },
    });
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Error fetching employees" },
      { status: 500 }
    );
  }
}

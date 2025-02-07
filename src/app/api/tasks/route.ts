import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//DONE : fetching Tasks endpoint
export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 },
    );
  }
}
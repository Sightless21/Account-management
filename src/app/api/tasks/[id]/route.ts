import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const deletedTask = await prisma.task.delete({ where: { id } });
    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Error deleting task" },
      { status: 500 },
    );
  }
}
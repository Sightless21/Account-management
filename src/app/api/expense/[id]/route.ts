import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const expense = await prisma.expenseClaim.findUnique({ where: { id } });
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Error fetching expense" },
      { status: 500 },
    );
  }
}
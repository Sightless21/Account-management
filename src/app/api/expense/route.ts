import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allExpense = await prisma.expenseClaim.findMany({
      select: {
        id: true,
        employeeName: true,
        title: true,
        transactionDate: true,
        description: true,
        status: true,
        attachmentUrl: true,
        attachmentPublicId: true,
        useForeignCurrency: true,
        country: true,
        expenses: true,
        createdAt: true
      }
    });
    return NextResponse.json(allExpense ?? [], { status: 200 })
  } catch (error) {
    console.error("Error fetching Expense:", error);
    return NextResponse.json(
      { error: "Error fetching Expense" },
      { status: 500 }
    );
  }
}
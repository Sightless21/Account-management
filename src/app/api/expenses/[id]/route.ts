import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/utils/cloudinary";
import { uploadFileToCloud } from "@/lib/cloudinaryUtils";
import { ExpenseClaimStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const expense = await prisma.expenseClaim.findUnique({
      where: { id: id },
    });
    if (!expense) return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error("Error fetching expense:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to fetch expense" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const formData = await req.formData();
    const expenseData = {
      title: formData.get("title") as string,
      employeeName: formData.get("employeeName") as string,
      transactionDate: formData.get("transactionDate") ? new Date(formData.get("transactionDate") as string) : undefined,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      useForeignCurrency: formData.get("useForeignCurrency") === "true",
      country: formData.get("country") as string,
      expenses: formData.get("expenses") ? JSON.parse(formData.get("expenses") as string) : undefined,
      attachment: formData.get("attachment") as File | null,
    };

    const existingExpense = await prisma.expenseClaim.findUnique({
      where: { id: id  },
    });
    if (!existingExpense) return NextResponse.json({ error: "Expense not found" }, { status: 404 });

    let uploadResult;
    if (expenseData.attachment instanceof File) {
      if (existingExpense.attachmentPublicId) {
        await cloudinary.uploader.destroy(existingExpense.attachmentPublicId);
      }
      uploadResult = await uploadFileToCloud(expenseData.attachment);
    }

    const updatedExpense = await prisma.expenseClaim.update({
      where: { id: id  },
      data: {
        title: expenseData.title || existingExpense.title,
        employeeName: expenseData.employeeName ?? existingExpense.employeeName,
        transactionDate: expenseData.transactionDate || existingExpense.transactionDate,
        description: expenseData.description || existingExpense.description,
        status: expenseData.status as ExpenseClaimStatus | undefined,
        attachmentUrl: uploadResult?.secure_url || existingExpense.attachmentUrl,
        attachmentPublicId: uploadResult?.public_id || existingExpense.attachmentPublicId,
        useForeignCurrency: expenseData.useForeignCurrency ?? existingExpense.useForeignCurrency,
        country: expenseData.country || existingExpense.country,
        expenses: expenseData.expenses || existingExpense.expenses,
      },
    });

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const expense = await prisma.expenseClaim.findUnique({
      where: { id: id },
    });
    if (!expense) return NextResponse.json({ error: "Expense not found" }, { status: 404 });

    if (expense.attachmentPublicId) {
      await cloudinary.uploader.destroy(expense.attachmentPublicId);
    }

    await prisma.expenseClaim.delete({
      where: { id: id  },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting expense:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
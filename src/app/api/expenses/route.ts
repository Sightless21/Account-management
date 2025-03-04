import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UploadApiResponse } from "cloudinary";
import { Expense } from "@/schema/expenseFormSchema";
import { uploadFileToCloud } from "@/lib/cloudinaryUtils"; // Helper function (see below)

// GET: Fetch all expenses
export async function GET() {
  try {
    const expenses = await prisma.expenseClaim.findMany();
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

// POST: Create a new expense
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const expenseData: Expense = {
      id: formData.get("id") as string,
      title: formData.get("title") as string,
      employeeName: formData.get("employeeName") as string,
      transactionDate: formData.get("transactionDate") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as Expense["status"],
      useForeignCurrency: formData.get("useForeignCurrency") === "true",
      country: formData.get("country") as string,
      expenses: JSON.parse(formData.get("expenses") as string),
      attachment: formData.get("attachment") as File | undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachmentUrl: "",
      attachmentPublicId: "",
    };

    let uploadResult: UploadApiResponse | undefined;
    if (expenseData.attachment instanceof File) {
      uploadResult = await uploadFileToCloud(expenseData.attachment, {
        folder: "expenses"
      });
    }

    const newExpense = await prisma.expenseClaim.create({
      data: {
        title: expenseData.title,
        employeeName: expenseData.employeeName ?? "",
        transactionDate: expenseData.transactionDate,
        description: expenseData.description,
        status: expenseData.status,
        attachmentUrl: uploadResult?.secure_url || null,
        attachmentPublicId: uploadResult?.public_id || null,
        useForeignCurrency: expenseData.useForeignCurrency,
        country: expenseData.country,
        expenses: expenseData.expenses,
        createdAt: expenseData.createdAt,
        updatedAt: expenseData.updatedAt,
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
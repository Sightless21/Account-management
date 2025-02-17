"use server";
import { prisma } from "@/lib/prisma"
import cloudinary from "@/utils/cloudinary";
import { UploadApiOptions, UploadApiResponse } from "cloudinary"
import streamifier from "streamifier";
import { ExpenseFormValues } from "@/schema/expenseFormSchema";

const uploadFileToCloud = async (file: File, options?: UploadApiOptions): Promise<UploadApiResponse | undefined> => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(new Error(error.message));
        resolve(result);
      });
      streamifier.createReadStream(buffer).pipe(stream);
    });
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export const handleExpense = async (expenseData: ExpenseFormValues) => {
  try {
    console.log("Received ExpenseFormValues:", expenseData);
    let uploadResult: UploadApiResponse | undefined;

    if (expenseData.attachment instanceof File) {
      uploadResult = await uploadFileToCloud(expenseData.attachment);
      console.log("Upload successful:", uploadResult);
    }

    const newExpense = await prisma.expenseClaim.create({
      data: {
        title: expenseData.title,
        transactionDate: expenseData.transactionDate,
        description: expenseData.description,
        attachmentUrl: uploadResult?.secure_url || null,
        attachmentPublicId: uploadResult?.public_id || null,
        useForeignCurrency: expenseData.useForeignCurrency,
        country: expenseData.country,
        expenses: expenseData.expenses,
      },
    });
    console.log("Expense created:", newExpense);
    return newExpense;
  } catch (error) {
    console.error("Error processing expense:", error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    const expense = await prisma.expenseClaim.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    // ถ้ามีไฟล์แนบ ให้ลบจาก Cloudinary ก่อน
    if (expense.attachmentPublicId) {
      await cloudinary.uploader.destroy(expense.attachmentPublicId);
      console.log("Deleted file from Cloudinary:", expense.attachmentPublicId);
    }

    // ลบ Expense จาก MongoDB
    await prisma.expenseClaim.delete({
      where: { id: expenseId },
    });

    console.log("Expense deleted:", expenseId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};
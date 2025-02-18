"use server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/utils/cloudinary";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { ExpenseFormValues } from "@/schema/expenseFormSchema";

/**
 * อัปโหลดไฟล์ไปยัง Cloudinary (ปรับให้รองรับหลายประเภท)
 */
const uploadFileToCloud = async (file: File, options?: UploadApiOptions): Promise<UploadApiResponse | undefined> => {
  try {
    if (!file) throw new Error("No file provided");

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Unsupported file type");
    }

    // สร้าง Buffer เพื่อลดหน่วยความจำที่ใช้
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "expenses",
          resource_type: file.type.includes("image") ? "image" : "raw", // แยกประเภท image กับ pdf
          quality: "auto", // ปรับคุณภาพอัตโนมัติ
          transformation: file.type.includes("image")
            ? [{ width: 800, crop: "scale" }] // ลดขนาดเฉพาะรูปภาพ
            : [],
          ...options,
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

/**
 * สร้าง Expense Claim พร้อมอัปโหลดไฟล์แนบ
 */
export const handleExpense = async (expenseData: ExpenseFormValues) => {
  try {
    console.log("Received ExpenseFormValues:", expenseData);
    let uploadResult: UploadApiResponse | undefined;

    // ตรวจสอบว่ามีไฟล์แนบ และเป็นประเภท File หรือไม่
    if (expenseData.attachment instanceof File) {
      uploadResult = await uploadFileToCloud(expenseData.attachment);
      console.log("Upload successful:", uploadResult);
    }

    const newExpense = await prisma.expenseClaim.create({
      data: {
        title: expenseData.title,
        employeeName: expenseData.employeename ?? "",
        transactionDate: expenseData.transactionDate,
        description: expenseData.description,
        status: expenseData.status,
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

/**
 * ลบ Expense Claim และลบไฟล์จาก Cloudinary
 */
export const deleteExpense = async (expenseId: string) => {
  try {
    const expense = await prisma.expenseClaim.findUnique({
      where: { id: expenseId },
    });

    if (!expense) throw new Error("Expense not found");

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

export const updateExpense = async (expenseId: string, expenseData: ExpenseFormValues) => {
  try {
    // ค้นหา Expense ที่จะอัพเดต
    const expense = await prisma.expenseClaim.findUnique({
      where: { id: expenseId },
    });

    if (!expense) throw new Error("Expense not found");

    let uploadResult: UploadApiResponse | undefined;

    // ถ้ามีการเปลี่ยนแปลงรูปภาพ (ไฟล์แนบใหม่)
    if (expenseData.attachment instanceof File) {
      // ลบไฟล์เดิมจาก Cloudinary (ถ้ามี)
      if (expense.attachmentPublicId) {
        await cloudinary.uploader.destroy(expense.attachmentPublicId);
        console.log("Deleted old file from Cloudinary:", expense.attachmentPublicId);
      }

      // อัพโหลดไฟล์ใหม่ไปยัง Cloudinary
      uploadResult = await uploadFileToCloud(expenseData.attachment);
      console.log("Upload successful:", uploadResult);
    }

    // อัพเดตข้อมูล Expense
    const updatedExpense = await prisma.expenseClaim.update({
      where: { id: expenseId },
      data: {
        title: expenseData.title,
        employeeName: expenseData.employeename ?? "",
        transactionDate: expenseData.transactionDate,
        description: expenseData.description,
        status: expenseData.status,
        attachmentUrl: uploadResult?.secure_url || expense.attachmentUrl, // ใช้ลิงค์เดิมหากไม่มีการอัพโหลดไฟล์ใหม่
        attachmentPublicId: uploadResult?.public_id || expense.attachmentPublicId, // ใช้ public_id เดิมหากไม่มีการอัพโหลดไฟล์ใหม่
        useForeignCurrency: expenseData.useForeignCurrency,
        country: expenseData.country,
        expenses: expenseData.expenses,
      },
    });

    console.log("Expense updated:", updatedExpense);
    return updatedExpense;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};
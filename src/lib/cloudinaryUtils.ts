// src/lib/cloudinaryUtils.ts
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import cloudinary from "@/utils/cloudinary";

export const uploadFileToCloud = async (fileInput: File | string, options?: UploadApiOptions): Promise<UploadApiResponse | undefined> => {
  try {
    if (!fileInput) throw new Error("No file provided");

    let buffer: Buffer;
    let fileType: string;

    // ตรวจสอบว่าเป็น base64 string หรือ File object
    if (typeof fileInput === "string" && fileInput.startsWith("data:image")) {
      const base64Data = fileInput.split(",")[1];
      buffer = Buffer.from(base64Data, "base64");

      // ดึงประเภทไฟล์จากส่วน header ของ base64 (เช่น "data:image/jpeg;base64,...")
      const mimeType = fileInput.match(/data:(.+);base64/)?.[1];
      if (!mimeType || !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(mimeType)) {
        throw new Error("Unsupported file type");
      }
      fileType = mimeType;
    } else if (fileInput instanceof File) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(fileInput.type)) {
        throw new Error("Unsupported file type");
      }
      buffer = Buffer.from(await fileInput.arrayBuffer());
      fileType = fileInput.type;
    } else {
      throw new Error("Invalid input: must be a File or base64 string");
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "user_avatars", // เปลี่ยน folder ตามที่ต้องการ
          resource_type: "image",
          quality: "auto",
          transformation: [{ width: 800, crop: "scale" }],
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

export const deleteFileOnCloud = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("File deletion failed:", error);
    throw error;
  }
};
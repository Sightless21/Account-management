import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import cloudinary from "@/utils/cloudinary";

export const uploadFileToCloud = async (file: File, options?: UploadApiOptions): Promise<UploadApiResponse | undefined> => {
  try {
    if (!file) throw new Error("No file provided");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf","image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Unsupported file type");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "expenses",
          resource_type: file.type.includes("image") ? "image" : "raw",
          quality: "auto",
          transformation: file.type.includes("image") ? [{ width: 800, crop: "scale" }] : [],
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
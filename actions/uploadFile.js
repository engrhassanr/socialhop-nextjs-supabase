"use server";
import { cld } from "@/lib/cloudinary";

export const uploadFile = async (file, folder) => {
  try {
    // Check if Cloudinary is properly configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary credentials not configured");
      return {
        error:
          "Cloudinary credentials not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.",
      };
    }

    // Convert file to base64 string for Cloudinary upload
    let fileData;
    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileData = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else {
      fileData = file;
    }

    // Upload image to Cloudinary using promises
    const res = await cld.v2.uploader.upload(fileData, {
      folder: `socialhop/${folder}`,
      resource_type: "auto",
    });
    console.log("file uploaded successfully");
    return res;
  } catch (e) {
    console.error("Error uploading file:", e);
    return {
      error: `Upload failed: ${e.message}`,
    };
  }
};

export const deleteFile = async (public_id) => {
  try {
    // Delete image from Cloudinary using promises
    const res = await cld.v2.uploader.destroy(public_id);
    console.log("file deleted successfully");
    return res;
  } catch (e) {
    console.log("Error deleting image:", e);
    return {
      error: "Failed to delete",
    };
  }
};

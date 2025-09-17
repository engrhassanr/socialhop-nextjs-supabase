"use server";
import { cld } from "@/lib/cloudinary";

export const uploadFile = async (file, folder) => {
  try {
    // Upload image to Cloudinary using promises
    const res = await cld.v2.uploader.upload(file, {
      folder: `socialhop/${folder}`,
      resource_type: "auto",
    });
    console.log("file uploaded successfully");
    return res;
  } catch (e) {
    console.log("Error uploading image:", e);
    return {
      error: "Failed to upload",
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

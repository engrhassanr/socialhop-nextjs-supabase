// Test Cloudinary configuration
import { cld } from "./lib/cloudinary.js";

console.log("Testing Cloudinary configuration...");

// Check if environment variables are set
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Environment variables:");
console.log("CLOUDINARY_CLOUD_NAME:", cloudName ? "✓ Set" : "✗ Missing");
console.log("CLOUDINARY_API_KEY:", apiKey ? "✓ Set" : "✗ Missing");
console.log("CLOUDINARY_API_SECRET:", apiSecret ? "✓ Set" : "✗ Missing");

if (!cloudName || !apiKey || !apiSecret) {
  console.error("\n❌ Cloudinary configuration is incomplete!");
  console.log("Please set the following environment variables:");
  console.log("- CLOUDINARY_CLOUD_NAME");
  console.log("- CLOUDINARY_API_KEY");
  console.log("- CLOUDINARY_API_SECRET");
  process.exit(1);
}

console.log("\n✅ Cloudinary configuration looks good!");

// Test Cloudinary connection
try {
  cld.v2.api.ping((error, result) => {
    if (error) {
      console.error("❌ Cloudinary connection failed:", error.message);
    } else {
      console.log("✅ Cloudinary connection successful!");
      console.log("Status:", result.status);
    }
  });
} catch (error) {
  console.error("❌ Error testing Cloudinary:", error.message);
}

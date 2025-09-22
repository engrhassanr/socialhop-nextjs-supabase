// Test database connection and banner functionality
import { db } from "./lib/db.js";

async function testDatabaseConnection() {
  console.log("Testing database connection...");

  try {
    // Test basic connection
    await db.$connect();
    console.log("✅ Database connected successfully");

    // Test user query
    const testUserId = "user_32V19bc07s2C3LlFKlC1lKgQQBV";
    const user = await db.user.findUnique({
      where: { id: testUserId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        banner_url: true,
        banner_id: true,
      },
    });

    console.log("User data:", user);

    if (user) {
      console.log("Banner URL:", user.banner_url);
      console.log("Banner ID:", user.banner_id);
    } else {
      console.log("❌ User not found");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await db.$disconnect();
  }
}

testDatabaseConnection();

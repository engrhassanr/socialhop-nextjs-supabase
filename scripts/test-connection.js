import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection successful!");
    console.log("📊 Test query result:", result);

    // Try to get table count
    const userCount = await prisma.user.count();
    console.log(`👥 Current users in database: ${userCount}`);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);

    if (error.message.includes("Can't reach database server")) {
      console.log("\n💡 Possible solutions:");
      console.log("1. Check if your Supabase database is paused");
      console.log("2. Go to Supabase Dashboard → Settings → Database → Resume");
      console.log("3. Verify your DATABASE_URL in .env file");
      console.log("4. Check your internet connection");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

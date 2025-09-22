// Script to set default banners for users who have null banner_url
import { PrismaClient } from "../lib/generated/prisma/index.js";

async function setDefaultBanners() {
  const prisma = new PrismaClient();

  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Find all users with null banner_url
    const usersWithNullBanner = await prisma.user.findMany({
      where: {
        banner_url: null,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        banner_url: true,
      },
    });

    console.log(
      `Found ${usersWithNullBanner.length} users with null banner_url`
    );

    if (usersWithNullBanner.length === 0) {
      console.log("No users need default banners set.");
      return;
    }

    // Update each user to have a default banner
    const defaultBannerUrl = "/images/banner.png";

    for (const user of usersWithNullBanner) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            banner_url: defaultBannerUrl,
            banner_id: null, // No cloudinary ID for default banner
          },
        });
        console.log(
          `✅ Set default banner for user: ${user.first_name} ${user.last_name} (@${user.username})`
        );
      } catch (error) {
        console.error(`❌ Failed to update user ${user.id}:`, error.message);
      }
    }

    console.log("✅ Default banner setup completed");

    // Verify the changes
    const updatedUsers = await prisma.user.findMany({
      where: {
        banner_url: defaultBannerUrl,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        banner_url: true,
      },
    });

    console.log(
      `✅ Verification: ${updatedUsers.length} users now have default banners`
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setDefaultBanners();

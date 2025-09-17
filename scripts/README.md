# Database Seeding Script

This script populates your Supabase database with dummy data for testing and development purposes.

## What it creates:

- **8 Users** with realistic profiles (names, usernames, avatars, banners)
- **10 Posts** with various content types (text, images, hashtags)
- **28 Trends** extracted from post hashtags
- **22 Likes** distributed across posts
- **20 Comments** with engaging responses
- **19 Follow relationships** creating a social network

## How to run:

1. Make sure your database is set up and migrations are applied:

   ```bash
   npx prisma migrate dev
   ```

2. Run the seeding script:

   ```bash
   npm run seed
   ```

   Or directly:

   ```bash
   node scripts/seed-database.js
   ```

## Important Notes:

- ⚠️ **This script will DELETE all existing data** before inserting new data
- Make sure your `DATABASE_URL` environment variable is properly configured
- The script uses Prisma Client, so ensure your schema is up to date
- All user IDs are prefixed with 'user\_' for easy identification

## Data Structure:

### Users

- Realistic names and usernames
- Profile images using existing avatar files
- Banner images
- Email addresses

### Posts

- Mix of text-only and media posts
- Relevant hashtags for trends
- Various topics: coding, nature, food, tutorials
- Cloudinary IDs for media posts

### Trends

- Extracted from post hashtags
- Popular topics like React, NextJS, TypeScript
- Food trends like "Mozzarella Pancakes"
- Learning resources like "Zainkeepscode"

### Social Interactions

- Realistic like patterns
- Engaging comments and replies
- Follow relationships creating a connected network

## Customization:

You can modify the data arrays in `seed-database.js` to:

- Add more users, posts, or interactions
- Change the content to match your app's theme
- Adjust the relationships between entities
- Add more realistic data for your specific use case

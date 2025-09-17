import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sample data (same as Prisma version)
const users = [
  {
    id: "user_1",
    email_address: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    image_url: "/images/avatar1.png",
    banner_url: "/images/banner.png",
  },
  {
    id: "user_2",
    email_address: "jane.smith@example.com",
    first_name: "Jane",
    last_name: "Smith",
    username: "janesmith",
    image_url: "/images/avatar2.png",
    banner_url: "/images/banner.png",
  },
  {
    id: "user_3",
    email_address: "mike.johnson@example.com",
    first_name: "Mike",
    last_name: "Johnson",
    username: "mikejohnson",
    image_url: "/images/avatar3.png",
    banner_url: "/images/banner.png",
  },
  {
    id: "user_4",
    email_address: "sarah.wilson@example.com",
    first_name: "Sarah",
    last_name: "Wilson",
    username: "sarahwilson",
    image_url: "/images/avatar.png",
    banner_url: "/images/banner.png",
  },
  {
    id: "user_5",
    email_address: "alex.brown@example.com",
    first_name: "Alex",
    last_name: "Brown",
    username: "alexbrown",
    image_url: "/images/placeholder-avatar.png",
    banner_url: "/images/banner.png",
  },
  {
    id: "user_6",
    email_address: "emma.davis@example.com",
    first_name: "Emma",
    last_name: "Davis",
    username: "emmadavis",
    image_url: "/images/avatar1.png",
    banner_url: "/images/banner.png",
  },
  {
    id: "user_7",
    email_address: "david.miller@example.com",
    first_name: "David",
    last_name: "Miller",
    username: "davidmiller",
    image_url: "/images/avatar2.png",
    banner_url: "/images/banner.png",
  },
  {
    id: "user_8",
    email_address: "lisa.garcia@example.com",
    first_name: "Lisa",
    last_name: "Garcia",
    username: "lisagarcia",
    image_url: "/images/avatar3.png",
    banner_url: "/images/banner.png",
  },
];

const posts = [
  {
    postText:
      "Just finished building an amazing React application! The new hooks are incredible. #React #JavaScript #WebDev",
    media: "/images/post1.jpg",
    authorId: "user_1",
    cld_id: "sample_cloudinary_id_1",
  },
  {
    postText:
      "Beautiful sunset today! Nature never fails to amaze me. 🌅 #Nature #Photography #Sunset",
    media: null,
    authorId: "user_2",
    cld_id: null,
  },
  {
    postText:
      "Learning Next.js 14 and it's absolutely mind-blowing! The app router is a game changer. #NextJS #WebDevelopment",
    media: null,
    authorId: "user_3",
    cld_id: null,
  },
  {
    postText:
      "Coffee and coding - the perfect combination! ☕️ #Coffee #Coding #DeveloperLife",
    media: null,
    authorId: "user_4",
    cld_id: null,
  },
  {
    postText:
      "Just deployed my first full-stack application! Feeling accomplished. #FullStack #Deployment #Achievement",
    media: null,
    authorId: "user_5",
    cld_id: null,
  },
  {
    postText:
      "Working on a new design system. Consistency is key in UI/UX! #Design #UI #UX #DesignSystem",
    media: null,
    authorId: "user_6",
    cld_id: null,
  },
  {
    postText:
      "TypeScript has been a lifesaver for large projects. Type safety is everything! #TypeScript #Programming",
    media: null,
    authorId: "user_7",
    cld_id: null,
  },
  {
    postText:
      "Database optimization tips: Always index your foreign keys and use proper query patterns. #Database #SQL #Optimization",
    media: null,
    authorId: "user_8",
    cld_id: null,
  },
  {
    postText:
      "Mozzarella pancakes recipe is a game changer! 🥞 #Cooking #Recipe #Food",
    media: null,
    authorId: "user_1",
    cld_id: null,
  },
  {
    postText:
      "Zainkeepscode tutorials are amazing! Learning so much from the content. #Learning #Programming #Tutorials",
    media: null,
    authorId: "user_2",
    cld_id: null,
  },
];

const trends = [
  { name: "React", postId: 1 },
  { name: "JavaScript", postId: 1 },
  { name: "WebDev", postId: 1 },
  { name: "Nature", postId: 2 },
  { name: "Photography", postId: 2 },
  { name: "Sunset", postId: 2 },
  { name: "NextJS", postId: 3 },
  { name: "WebDevelopment", postId: 3 },
  { name: "Coffee", postId: 4 },
  { name: "Coding", postId: 4 },
  { name: "DeveloperLife", postId: 4 },
  { name: "FullStack", postId: 5 },
  { name: "Deployment", postId: 5 },
  { name: "Achievement", postId: 5 },
  { name: "Design", postId: 6 },
  { name: "UI", postId: 6 },
  { name: "UX", postId: 6 },
  { name: "DesignSystem", postId: 6 },
  { name: "TypeScript", postId: 7 },
  { name: "Programming", postId: 7 },
  { name: "Database", postId: 8 },
  { name: "SQL", postId: 8 },
  { name: "Optimization", postId: 8 },
  { name: "Cooking", postId: 9 },
  { name: "Recipe", postId: 9 },
  { name: "Food", postId: 9 },
  { name: "Learning", postId: 10 },
  { name: "Tutorials", postId: 10 },
];

const likes = [
  { postId: 1, authorId: "user_2" },
  { postId: 1, authorId: "user_3" },
  { postId: 1, authorId: "user_4" },
  { postId: 2, authorId: "user_1" },
  { postId: 2, authorId: "user_5" },
  { postId: 3, authorId: "user_1" },
  { postId: 3, authorId: "user_2" },
  { postId: 3, authorId: "user_6" },
  { postId: 4, authorId: "user_3" },
  { postId: 4, authorId: "user_7" },
  { postId: 5, authorId: "user_4" },
  { postId: 5, authorId: "user_8" },
  { postId: 6, authorId: "user_1" },
  { postId: 6, authorId: "user_5" },
  { postId: 7, authorId: "user_2" },
  { postId: 7, authorId: "user_6" },
  { postId: 8, authorId: "user_3" },
  { postId: 8, authorId: "user_7" },
  { postId: 9, authorId: "user_4" },
  { postId: 9, authorId: "user_8" },
  { postId: 10, authorId: "user_1" },
  { postId: 10, authorId: "user_5" },
];

const comments = [
  {
    comment: "Great work! React is indeed amazing.",
    postId: 1,
    authorId: "user_2",
  },
  { comment: "I love the new hooks too!", postId: 1, authorId: "user_3" },
  { comment: "Stunning photo! 📸", postId: 2, authorId: "user_1" },
  { comment: "Nature is the best photographer", postId: 2, authorId: "user_4" },
  {
    comment:
      "Next.js 14 is incredible! The performance improvements are noticeable.",
    postId: 3,
    authorId: "user_1",
  },
  {
    comment: "I'm also learning Next.js, any tips?",
    postId: 3,
    authorId: "user_5",
  },
  {
    comment: "Coffee and coding - my daily routine! ☕️",
    postId: 4,
    authorId: "user_2",
  },
  {
    comment: "Same here! Can't start coding without coffee",
    postId: 4,
    authorId: "user_6",
  },
  {
    comment: "Congratulations on the deployment! 🎉",
    postId: 5,
    authorId: "user_3",
  },
  { comment: "What tech stack did you use?", postId: 5, authorId: "user_7" },
  {
    comment: "Design systems are so important for scalability!",
    postId: 6,
    authorId: "user_4",
  },
  {
    comment: "Couldn't agree more! Consistency is key",
    postId: 6,
    authorId: "user_8",
  },
  {
    comment: "TypeScript has saved me from so many bugs!",
    postId: 7,
    authorId: "user_1",
  },
  {
    comment: "The type safety is a game changer",
    postId: 7,
    authorId: "user_5",
  },
  {
    comment: "Great tips! Database optimization is crucial",
    postId: 8,
    authorId: "user_2",
  },
  {
    comment: "Thanks for sharing these insights!",
    postId: 8,
    authorId: "user_6",
  },
  { comment: "I need to try this recipe! 🥞", postId: 9, authorId: "user_3" },
  { comment: "Looks delicious!", postId: 9, authorId: "user_7" },
  {
    comment: "Zainkeepscode is amazing! Love the tutorials",
    postId: 10,
    authorId: "user_4",
  },
  {
    comment: "The content quality is top-notch",
    postId: 10,
    authorId: "user_8",
  },
];

const follows = [
  { followerId: "user_1", followingId: "user_2" },
  { followerId: "user_1", followingId: "user_3" },
  { followerId: "user_1", followingId: "user_4" },
  { followerId: "user_2", followingId: "user_1" },
  { followerId: "user_2", followingId: "user_5" },
  { followerId: "user_2", followingId: "user_6" },
  { followerId: "user_3", followingId: "user_1" },
  { followerId: "user_3", followingId: "user_7" },
  { followerId: "user_3", followingId: "user_8" },
  { followerId: "user_4", followingId: "user_2" },
  { followerId: "user_4", followingId: "user_3" },
  { followerId: "user_5", followingId: "user_1" },
  { followerId: "user_5", followingId: "user_4" },
  { followerId: "user_6", followingId: "user_2" },
  { followerId: "user_6", followingId: "user_5" },
  { followerId: "user_7", followingId: "user_3" },
  { followerId: "user_7", followingId: "user_6" },
  { followerId: "user_8", followingId: "user_4" },
  { followerId: "user_8", followingId: "user_7" },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding with Supabase client...");
    console.log(
      "⚠️  Note: Using Supabase client to bypass RLS issues with Prisma"
    );

    // Test connection first
    console.log("🔍 Testing Supabase connection...");
    const { data: testData, error: testError } = await supabase
      .from("User")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("❌ Supabase connection failed:", testError);
      return;
    }
    console.log("✅ Supabase connection successful!");

    // Create users one by one to handle potential RLS issues
    console.log("👥 Creating users...");
    let createdUsers = 0;
    for (const user of users) {
      const { data, error } = await supabase
        .from("User")
        .upsert(user, { onConflict: "id" });

      if (error) {
        console.warn(
          `⚠️  Warning: Could not create user ${user.username}:`,
          error.message
        );
      } else {
        console.log(`✅ Created user: ${user.username}`);
        createdUsers++;
      }
    }

    // Create posts
    console.log("📝 Creating posts...");
    let createdPosts = 0;
    for (const post of posts) {
      const { data, error } = await supabase.from("Post").insert(post);

      if (error) {
        console.warn(`⚠️  Warning: Could not create post:`, error.message);
      } else {
        console.log(`✅ Created post by ${post.authorId}`);
        createdPosts++;
      }
    }

    // Create trends
    console.log("🏷️ Creating trends...");
    let createdTrends = 0;
    for (const trend of trends) {
      const { data, error } = await supabase.from("Trend").insert(trend);

      if (error) {
        console.warn(
          `⚠️  Warning: Could not create trend ${trend.name}:`,
          error.message
        );
      } else {
        console.log(`✅ Created trend: ${trend.name}`);
        createdTrends++;
      }
    }

    // Create likes
    console.log("❤️ Creating likes...");
    let createdLikes = 0;
    for (const like of likes) {
      const { data, error } = await supabase.from("Like").insert(like);

      if (error) {
        console.warn(`⚠️  Warning: Could not create like:`, error.message);
      } else {
        createdLikes++;
      }
    }

    // Create comments
    console.log("💬 Creating comments...");
    let createdComments = 0;
    for (const comment of comments) {
      const { data, error } = await supabase.from("Comment").insert(comment);

      if (error) {
        console.warn(`⚠️  Warning: Could not create comment:`, error.message);
      } else {
        createdComments++;
      }
    }

    // Create follows
    console.log("👥 Creating follow relationships...");
    let createdFollows = 0;
    for (const follow of follows) {
      const { data, error } = await supabase.from("Follow").insert(follow);

      if (error) {
        console.warn(`⚠️  Warning: Could not create follow:`, error.message);
      } else {
        createdFollows++;
      }
    }

    console.log("✅ Database seeding completed!");
    console.log(`📊 Successfully created:`);
    console.log(`   - ${createdUsers} users`);
    console.log(`   - ${createdPosts} posts`);
    console.log(`   - ${createdTrends} trends`);
    console.log(`   - ${createdLikes} likes`);
    console.log(`   - ${createdComments} comments`);
    console.log(`   - ${createdFollows} follow relationships`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seeding function
seedDatabase().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});

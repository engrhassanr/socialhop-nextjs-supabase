import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sample users data
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
];

// Sample posts data
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
];

// Sample trends data
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
];

// Sample likes data
const likes = [
  { postId: 1, authorId: "user_2" },
  { postId: 1, authorId: "user_3" },
  { postId: 2, authorId: "user_1" },
  { postId: 2, authorId: "user_4" },
  { postId: 3, authorId: "user_1" },
  { postId: 3, authorId: "user_5" },
  { postId: 4, authorId: "user_2" },
  { postId: 4, authorId: "user_3" },
  { postId: 5, authorId: "user_1" },
  { postId: 5, authorId: "user_4" },
];

// Sample comments data
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
    authorId: "user_3",
  },
  {
    comment: "Congratulations on the deployment! 🎉",
    postId: 5,
    authorId: "user_1",
  },
  { comment: "What tech stack did you use?", postId: 5, authorId: "user_4" },
];

// Sample follow relationships
const follows = [
  { followerId: "user_1", followingId: "user_2" },
  { followerId: "user_1", followingId: "user_3" },
  { followerId: "user_2", followingId: "user_1" },
  { followerId: "user_2", followingId: "user_4" },
  { followerId: "user_3", followingId: "user_1" },
  { followerId: "user_3", followingId: "user_5" },
  { followerId: "user_4", followingId: "user_2" },
  { followerId: "user_4", followingId: "user_3" },
  { followerId: "user_5", followingId: "user_1" },
  { followerId: "user_5", followingId: "user_4" },
];

async function seedSupabase() {
  try {
    console.log("🌱 Starting Supabase seeding...");

    // Clear existing data (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await supabase.from("Follow").delete().neq("id", 0);
    await supabase.from("Comment").delete().neq("id", 0);
    await supabase.from("Like").delete().neq("id", 0);
    await supabase.from("Trend").delete().neq("id", 0);
    await supabase.from("Post").delete().neq("id", 0);
    await supabase.from("User").delete().neq("id", "");

    // Create users
    console.log("👥 Creating users...");
    const { data: usersData, error: usersError } = await supabase
      .from("User")
      .insert(users);

    if (usersError) {
      console.error("Error creating users:", usersError);
      return;
    }

    // Create posts
    console.log("📝 Creating posts...");
    const { data: postsData, error: postsError } = await supabase
      .from("Post")
      .insert(posts);

    if (postsError) {
      console.error("Error creating posts:", postsError);
      return;
    }

    // Create trends
    console.log("🏷️ Creating trends...");
    const { data: trendsData, error: trendsError } = await supabase
      .from("Trend")
      .insert(trends);

    if (trendsError) {
      console.error("Error creating trends:", trendsError);
      return;
    }

    // Create likes
    console.log("❤️ Creating likes...");
    const { data: likesData, error: likesError } = await supabase
      .from("Like")
      .insert(likes);

    if (likesError) {
      console.error("Error creating likes:", likesError);
      return;
    }

    // Create comments
    console.log("💬 Creating comments...");
    const { data: commentsData, error: commentsError } = await supabase
      .from("Comment")
      .insert(comments);

    if (commentsError) {
      console.error("Error creating comments:", commentsError);
      return;
    }

    // Create follows
    console.log("👥 Creating follow relationships...");
    const { data: followsData, error: followsError } = await supabase
      .from("Follow")
      .insert(follows);

    if (followsError) {
      console.error("Error creating follows:", followsError);
      return;
    }

    console.log("✅ Supabase seeding completed successfully!");
    console.log(`📊 Created:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${trends.length} trends`);
    console.log(`   - ${likes.length} likes`);
    console.log(`   - ${comments.length} comments`);
    console.log(`   - ${follows.length} follow relationships`);
  } catch (error) {
    console.error("❌ Error seeding Supabase:", error);
    throw error;
  }
}

// Run the seeding function
seedSupabase().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});

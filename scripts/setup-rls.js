import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config();

// Initialize Supabase client with service role key (for admin operations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupRLS() {
  console.log("🔐 Setting up Row Level Security (RLS) policies...");

  try {
    // Enable RLS on all tables
    const tables = ["User", "Post", "Comment", "Like", "Follow", "Trend"];

    for (const table of tables) {
      console.log(`\n📋 Setting up RLS for ${table} table...`);

      // Enable RLS
      const { error: rlsError } = await supabase.rpc("exec_sql", {
        sql: `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`,
      });

      if (rlsError) {
        console.log(
          `⚠️  RLS already enabled for ${table} or error:`,
          rlsError.message
        );
      } else {
        console.log(`✅ RLS enabled for ${table}`);
      }
    }

    // Create RLS policies for User table
    console.log("\n👤 Creating User table policies...");
    await createUserPolicies();

    // Create RLS policies for Post table
    console.log("\n📝 Creating Post table policies...");
    await createPostPolicies();

    // Create RLS policies for Comment table
    console.log("\n💬 Creating Comment table policies...");
    await createCommentPolicies();

    // Create RLS policies for Like table
    console.log("\n❤️  Creating Like table policies...");
    await createLikePolicies();

    // Create RLS policies for Follow table
    console.log("\n👥 Creating Follow table policies...");
    await createFollowPolicies();

    // Create RLS policies for Trend table
    console.log("\n🏷️  Creating Trend table policies...");
    await createTrendPolicies();

    console.log("\n🎉 RLS setup completed successfully!");
    console.log("\n📝 Summary of policies created:");
    console.log("   • Users can read all profiles, update only their own");
    console.log(
      "   • Posts are public for reading, users can create/update/delete their own"
    );
    console.log(
      "   • Comments are public for reading, users can create/update/delete their own"
    );
    console.log(
      "   • Likes are public for reading, users can create/delete their own"
    );
    console.log(
      "   • Follow relationships are public for reading, users can create/delete their own"
    );
    console.log("   • Trends are public for reading, automatically managed");
  } catch (error) {
    console.error("❌ Error setting up RLS:", error);
  }
}

async function createUserPolicies() {
  const policies = [
    {
      name: "Users can read all profiles",
      sql: `CREATE POLICY "Users can read all profiles" ON "User" FOR SELECT USING (true);`,
    },
    {
      name: "Users can update their own profile",
      sql: `CREATE POLICY "Users can update their own profile" ON "User" FOR UPDATE USING (auth.uid()::text = id);`,
    },
    {
      name: "Users can insert their own profile",
      sql: `CREATE POLICY "Users can insert their own profile" ON "User" FOR INSERT WITH CHECK (auth.uid()::text = id);`,
    },
    {
      name: "Users can delete their own profile",
      sql: `CREATE POLICY "Users can delete their own profile" ON "User" FOR DELETE USING (auth.uid()::text = id);`,
    },
  ];

  await createPolicies("User", policies);
}

async function createPostPolicies() {
  const policies = [
    {
      name: "Posts are public for reading",
      sql: `CREATE POLICY "Posts are public for reading" ON "Post" FOR SELECT USING (true);`,
    },
    {
      name: "Users can create their own posts",
      sql: `CREATE POLICY "Users can create their own posts" ON "Post" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");`,
    },
    {
      name: "Users can update their own posts",
      sql: `CREATE POLICY "Users can update their own posts" ON "Post" FOR UPDATE USING (auth.uid()::text = "authorId");`,
    },
    {
      name: "Users can delete their own posts",
      sql: `CREATE POLICY "Users can delete their own posts" ON "Post" FOR DELETE USING (auth.uid()::text = "authorId");`,
    },
  ];

  await createPolicies("Post", policies);
}

async function createCommentPolicies() {
  const policies = [
    {
      name: "Comments are public for reading",
      sql: `CREATE POLICY "Comments are public for reading" ON "Comment" FOR SELECT USING (true);`,
    },
    {
      name: "Users can create their own comments",
      sql: `CREATE POLICY "Users can create their own comments" ON "Comment" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");`,
    },
    {
      name: "Users can update their own comments",
      sql: `CREATE POLICY "Users can update their own comments" ON "Comment" FOR UPDATE USING (auth.uid()::text = "authorId");`,
    },
    {
      name: "Users can delete their own comments",
      sql: `CREATE POLICY "Users can delete their own comments" ON "Comment" FOR DELETE USING (auth.uid()::text = "authorId");`,
    },
  ];

  await createPolicies("Comment", policies);
}

async function createLikePolicies() {
  const policies = [
    {
      name: "Likes are public for reading",
      sql: `CREATE POLICY "Likes are public for reading" ON "Like" FOR SELECT USING (true);`,
    },
    {
      name: "Users can create their own likes",
      sql: `CREATE POLICY "Users can create their own likes" ON "Like" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");`,
    },
    {
      name: "Users can delete their own likes",
      sql: `CREATE POLICY "Users can delete their own likes" ON "Like" FOR DELETE USING (auth.uid()::text = "authorId");`,
    },
  ];

  await createPolicies("Like", policies);
}

async function createFollowPolicies() {
  const policies = [
    {
      name: "Follow relationships are public for reading",
      sql: `CREATE POLICY "Follow relationships are public for reading" ON "Follow" FOR SELECT USING (true);`,
    },
    {
      name: "Users can create their own follow relationships",
      sql: `CREATE POLICY "Users can create their own follow relationships" ON "Follow" FOR INSERT WITH CHECK (auth.uid()::text = "followerId");`,
    },
    {
      name: "Users can delete their own follow relationships",
      sql: `CREATE POLICY "Users can delete their own follow relationships" ON "Follow" FOR DELETE USING (auth.uid()::text = "followerId");`,
    },
  ];

  await createPolicies("Follow", policies);
}

async function createTrendPolicies() {
  const policies = [
    {
      name: "Trends are public for reading",
      sql: `CREATE POLICY "Trends are public for reading" ON "Trend" FOR SELECT USING (true);`,
    },
    {
      name: "System can manage trends",
      sql: `CREATE POLICY "System can manage trends" ON "Trend" FOR ALL USING (true);`,
    },
  ];

  await createPolicies("Trend", policies);
}

async function createPolicies(tableName, policies) {
  for (const policy of policies) {
    try {
      // First, try to drop the policy if it exists
      const dropSql = `DROP POLICY IF EXISTS "${policy.name}" ON "${tableName}";`;
      await supabase.rpc("exec_sql", { sql: dropSql });

      // Create the policy
      const { error } = await supabase.rpc("exec_sql", { sql: policy.sql });

      if (error) {
        console.log(`⚠️  Policy "${policy.name}" error:`, error.message);
      } else {
        console.log(`✅ Policy "${policy.name}" created successfully`);
      }
    } catch (error) {
      console.log(`❌ Error creating policy "${policy.name}":`, error.message);
    }
  }
}

// Alternative approach using direct SQL execution
async function setupRLSAlternative() {
  console.log("🔐 Setting up RLS using alternative method...");

  const rlsSetupSQL = `
    -- Enable RLS on all tables
    ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "Follow" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "Trend" ENABLE ROW LEVEL SECURITY;

    -- User policies
    DROP POLICY IF EXISTS "Users can read all profiles" ON "User";
    CREATE POLICY "Users can read all profiles" ON "User" FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can update their own profile" ON "User";
    CREATE POLICY "Users can update their own profile" ON "User" FOR UPDATE USING (auth.uid()::text = id);
    
    DROP POLICY IF EXISTS "Users can insert their own profile" ON "User";
    CREATE POLICY "Users can insert their own profile" ON "User" FOR INSERT WITH CHECK (auth.uid()::text = id);
    
    DROP POLICY IF EXISTS "Users can delete their own profile" ON "User";
    CREATE POLICY "Users can delete their own profile" ON "User" FOR DELETE USING (auth.uid()::text = id);

    -- Post policies
    DROP POLICY IF EXISTS "Posts are public for reading" ON "Post";
    CREATE POLICY "Posts are public for reading" ON "Post" FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can create their own posts" ON "Post";
    CREATE POLICY "Users can create their own posts" ON "Post" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");
    
    DROP POLICY IF EXISTS "Users can update their own posts" ON "Post";
    CREATE POLICY "Users can update their own posts" ON "Post" FOR UPDATE USING (auth.uid()::text = "authorId");
    
    DROP POLICY IF EXISTS "Users can delete their own posts" ON "Post";
    CREATE POLICY "Users can delete their own posts" ON "Post" FOR DELETE USING (auth.uid()::text = "authorId");

    -- Comment policies
    DROP POLICY IF EXISTS "Comments are public for reading" ON "Comment";
    CREATE POLICY "Comments are public for reading" ON "Comment" FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can create their own comments" ON "Comment";
    CREATE POLICY "Users can create their own comments" ON "Comment" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");
    
    DROP POLICY IF EXISTS "Users can update their own comments" ON "Comment";
    CREATE POLICY "Users can update their own comments" ON "Comment" FOR UPDATE USING (auth.uid()::text = "authorId");
    
    DROP POLICY IF EXISTS "Users can delete their own comments" ON "Comment";
    CREATE POLICY "Users can delete their own comments" ON "Comment" FOR DELETE USING (auth.uid()::text = "authorId");

    -- Like policies
    DROP POLICY IF EXISTS "Likes are public for reading" ON "Like";
    CREATE POLICY "Likes are public for reading" ON "Like" FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can create their own likes" ON "Like";
    CREATE POLICY "Users can create their own likes" ON "Like" FOR INSERT WITH CHECK (auth.uid()::text = "authorId");
    
    DROP POLICY IF EXISTS "Users can delete their own likes" ON "Like";
    CREATE POLICY "Users can delete their own likes" ON "Like" FOR DELETE USING (auth.uid()::text = "authorId");

    -- Follow policies
    DROP POLICY IF EXISTS "Follow relationships are public for reading" ON "Follow";
    CREATE POLICY "Follow relationships are public for reading" ON "Follow" FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can create their own follow relationships" ON "Follow";
    CREATE POLICY "Users can create their own follow relationships" ON "Follow" FOR INSERT WITH CHECK (auth.uid()::text = "followerId");
    
    DROP POLICY IF EXISTS "Users can delete their own follow relationships" ON "Follow";
    CREATE POLICY "Users can delete their own follow relationships" ON "Follow" FOR DELETE USING (auth.uid()::text = "followerId");

    -- Trend policies
    DROP POLICY IF EXISTS "Trends are public for reading" ON "Trend";
    CREATE POLICY "Trends are public for reading" ON "Trend" FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "System can manage trends" ON "Trend";
    CREATE POLICY "System can manage trends" ON "Trend" FOR ALL USING (true);
  `;

  try {
    const { error } = await supabase.rpc("exec_sql", { sql: rlsSetupSQL });

    if (error) {
      console.error("❌ Error setting up RLS:", error);
    } else {
      console.log("✅ RLS setup completed successfully!");
    }
  } catch (error) {
    console.error("❌ Error executing RLS setup:", error);
  }
}

// Run the setup
if (process.argv.includes("--alternative")) {
  setupRLSAlternative();
} else {
  setupRLS();
}

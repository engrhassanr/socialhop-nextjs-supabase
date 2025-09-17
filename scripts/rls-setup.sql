-- Row Level Security Setup for SocialHop (Clerk Authentication)
-- Run this script in your Supabase SQL Editor

-- Option 1: Disable RLS entirely (Recommended for Clerk-based apps)
-- This is the simplest approach since Clerk handles authentication at the application level

-- Disable RLS on all tables
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Like" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Follow" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Trend" DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can read all profiles" ON "User";
DROP POLICY IF EXISTS "Users can update their own profile" ON "User";
DROP POLICY IF EXISTS "Users can insert their own profile" ON "User";
DROP POLICY IF EXISTS "Users can delete their own profile" ON "User";

DROP POLICY IF EXISTS "Posts are public for reading" ON "Post";
DROP POLICY IF EXISTS "Users can create their own posts" ON "Post";
DROP POLICY IF EXISTS "Users can update their own posts" ON "Post";
DROP POLICY IF EXISTS "Users can delete their own posts" ON "Post";

DROP POLICY IF EXISTS "Comments are public for reading" ON "Comment";
DROP POLICY IF EXISTS "Users can create their own comments" ON "Comment";
DROP POLICY IF EXISTS "Users can update their own comments" ON "Comment";
DROP POLICY IF EXISTS "Users can delete their own comments" ON "Comment";

DROP POLICY IF EXISTS "Likes are public for reading" ON "Like";
DROP POLICY IF EXISTS "Users can create their own likes" ON "Like";
DROP POLICY IF EXISTS "Users can delete their own likes" ON "Like";

DROP POLICY IF EXISTS "Follow relationships are public for reading" ON "Follow";
DROP POLICY IF EXISTS "Users can create their own follow relationships" ON "Follow";
DROP POLICY IF EXISTS "Users can delete their own follow relationships" ON "Follow";

DROP POLICY IF EXISTS "Trends are public for reading" ON "Trend";
DROP POLICY IF EXISTS "System can manage trends" ON "Trend";

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('User', 'Post', 'Comment', 'Like', 'Follow', 'Trend');

-- Optional: If you want to keep RLS enabled but with permissive policies, 
-- uncomment the following section and comment out the DISABLE statements above

/*
-- Option 2: Enable RLS with permissive policies (Alternative approach)

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Follow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trend" ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all operations)
CREATE POLICY "Allow all User operations" ON "User" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all Post operations" ON "Post" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all Comment operations" ON "Comment" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all Like operations" ON "Like" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all Follow operations" ON "Follow" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all Trend operations" ON "Trend" FOR ALL USING (true) WITH CHECK (true);
*/

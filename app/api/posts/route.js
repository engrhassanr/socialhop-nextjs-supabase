import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lastCursor = searchParams.get("cursor");
    const id = searchParams.get("id") || "all";
    const fetchAll = searchParams.get("all") === "true";

    const { userId } = auth();
    const take = 5;

    // Build the query for Supabase
    let query = supabase
      .from("Post")
      .select(
        `
        *,
        author:User(*),
        likes:Like(*),
        comments:Comment(*, author:User(*))
      `
      )
      .order("createdAt", { ascending: false });

    if (!fetchAll) {
      query = query.limit(take);
    }

    // Apply filters
    if (id !== "all") {
      query = query.eq("authorId", id);
    }

    // Apply cursor-based pagination
    if (!fetchAll && lastCursor) {
      const cursorValue = parseInt(lastCursor);
      query = query.lt("id", cursorValue);
    }

    const { data: posts, error } = await query;

    // If Supabase has data, use it
    if (!error && posts && posts.length > 0) {
      if (fetchAll) {
        return Response.json({
          data: posts,
          metaData: { lastCursor: null, hasMore: false },
        });
      }
      // Check if there are more posts for pagination
      const lastPostId = posts[posts.length - 1].id;
      const { count } = await supabase
        .from("Post")
        .select("id", { count: "exact", head: true })
        .lt("id", lastPostId);

      console.log("/api/posts fetched from Supabase:", posts.length);

      return Response.json({
        data: posts,
        metaData: {
          lastCursor: count > 0 ? lastPostId : null,
          hasMore: count > 0,
        },
      });
    }

    // Supabase returned no rows or an error
    console.log("Supabase returned no posts or error:", error?.message);
    return Response.json({
      data: [],
      metaData: { lastCursor: null, hasMore: false },
    });
  } catch (e) {
    console.error("API route error:", e);
    return new Response("Failed to fetch posts", { status: 500 });
  }
}

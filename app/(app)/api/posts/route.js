import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lastCursor = searchParams.get("cursor");
    const id = searchParams.get("id") || "all";

    const { userId } = auth();
    const take = 5;

    let where = {};
    if (id !== "all") {
      where = { author: { id } };
    } else if (userId) {
      // Personalized feed handled on client by calling actions if needed; here return global posts
      where = {};
    }

    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: {
          include: { author: true },
        },
      },
      where,
      take,
      ...(lastCursor && {
        skip: 1,
        cursor: { id: Number.isNaN(+lastCursor) ? lastCursor : +lastCursor },
      }),
      orderBy: { createdAt: "desc" },
    });

    if (posts.length === 0) {
      return Response.json({
        data: [],
        metaData: { lastCursor: null, hasMore: false },
      });
    }

    const cursor = posts[posts.length - 1].id;
    const morePosts = await db.post.findMany({
      where,
      take,
      skip: 1,
      cursor: { id: cursor },
    });

    // Debug log on the server to verify data coming from the database
    console.log("/api/posts fetched posts count:", posts.length);
    if (posts[0]) {
      console.log("/api/posts first post sample:", {
        id: posts[0].id,
        authorId: posts[0].authorId,
        createdAt: posts[0].createdAt,
        hasMedia: Boolean(posts[0].media),
        likes: posts[0].likes?.length,
        comments: posts[0].comments?.length,
      });
    }

    return Response.json({
      data: posts,
      metaData: { lastCursor: cursor, hasMore: morePosts.length > 0 },
    });
  } catch (e) {
    console.error(e);
    return new Response("Failed to fetch posts", { status: 500 });
  }
}

"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { uploadFile } from "./uploadFile";
import { checkPostForTrends } from "@/utils";
import { getAllFollowersAndFollowings } from "./user";

export const createPost = async (post) => {
  const { postText, media } = post;
  try {
    console.log("createPost called with:", { postText, media: !!media });

    let cld_id;
    let assetUrl;
    const { userId } = auth();
    console.log("Auth check:", { userId, authenticated: !!userId });

    if (!userId) {
      console.error("User not authenticated");
      throw Error("Not authenticated - please sign in");
    }

    // Validate input - allow empty postText if there's media
    const hasText = postText && postText.trim() !== "";
    const hasMedia = !!media;

    console.log("Validation check:", { hasText, hasMedia, postText });

    if (!hasText && !hasMedia) {
      throw Error("Post must contain text or media");
    }

    if (media) {
      console.log("Uploading media for user:", userId);
      const res = await uploadFile(media, `/posts/${userId}`);
      console.log("Upload response:", res);
      if (res.error) {
        throw new Error(`Upload failed: ${res.error}`);
      }
      const { public_id, secure_url } = res;
      cld_id = public_id;
      assetUrl = secure_url;
      console.log("Media uploaded successfully:", secure_url);
    }

    console.log("Creating post with data:", {
      postText,
      media: assetUrl,
      cld_id,
      userId,
    });

    const newPost = await db.post.create({
      data: {
        postText,
        media: assetUrl,
        cld_id,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });

    console.log("Post created successfully:", newPost.id);

    const trends = checkPostForTrends(postText);
    if (trends.length > 0) {
      createTrends(trends, newPost.id);
    }

    return {
      data: newPost,
    };
  } catch (e) {
    console.error("Error creating post:", e);
    throw new Error(e.message || "Failed to create post");
  }
};

export const getPosts = async (lastCursor, id) => {
  try {
    // const { id: userId } = await currentUser();
    const take = 5;
    const where = id !== "all" ? { author: { id } } : {};
    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      where,
      take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return {
        data: [],
        metaData: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }
    const lastPostInResults = posts[posts.length - 1];
    const cursor = lastPostInResults?.id;

    const morePosts = await db.post.findMany({
      where,
      take,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });
    return {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasMore: morePosts.length > 0,
      },
    };
  } catch (e) {
    console.log(e);
    throw Error("Failed to fetch posts");
  }
};

export const getMyPostsFeed = async (lastCursor) => {
  try {
    const { userId } = auth();
    const authUser = userId ? { id: userId } : null;
    const take = 5;

    // If not logged in, fall back to public feed (all posts)
    if (!authUser || !authUser.id) {
      const posts = await db.post.findMany({
        include: {
          author: true,
          likes: true,
          comments: {
            include: {
              author: true,
            },
          },
        },
        take,
        ...(lastCursor && {
          skip: 1,
          cursor: {
            id: lastCursor,
          },
        }),
        orderBy: {
          createdAt: "desc",
        },
      });

      if (posts.length === 0) {
        return {
          data: [],
          metaData: {
            lastCursor: null,
            hasMore: false,
          },
        };
      }
      const lastPostInResults = posts[posts.length - 1];
      const cursor = lastPostInResults?.id;
      const morePosts = await db.post.findMany({
        take,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
      return {
        data: posts,
        metaData: {
          lastCursor: cursor,
          hasMore: morePosts.length > 0,
        },
      };
    }

    const { id } = authUser;
    const { followers, following } = await getAllFollowersAndFollowings(id);
    const followingIds = following.map((f) => f.followingId);
    const followerIds = followers.map((f) => f.followerId);

    // Combine the lists and include your own id
    const userIds = [...new Set([...followingIds, ...followerIds, id])];

    const where = { author: { id: { in: userIds } } };
    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      where,
      take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return {
        data: [],
        metaData: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }
    const lastPostInResults = posts[posts.length - 1];
    const cursor = lastPostInResults?.id;
    const morePosts = await db.post.findMany({
      where,
      take,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });
    return {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasMore: morePosts.length > 0,
      },
    };
  } catch (e) {
    console.log(e);
    throw Error("Failed to fetch posts");
  }
};

export const updatePostLike = async (postId, type) => {
  // type is either "like" or "unlike"
  try {
    const { userId } = auth();
    if (!userId) throw Error("Not authenticated");

    // find the post in db
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });
    if (!post) {
      return {
        error: "Post not found",
      };
    }

    // check if user has already liked the post
    const like = post.likes.find((like) => like.authorId === userId);

    // if user has already liked the post,
    if (like) {
      // if user is trying to like the post again, return the post
      if (type === "like") {
        return {
          data: post,
        };
      }
      // otherwise, delete the like
      else {
        await db.like.delete({
          where: {
            id: like.id,
          },
        });
        console.log("like deleted");
      }
    }
    // if user has not already liked the post
    else {
      // if user is trying to unlike the post, return the post
      if (type === "unlike") {
        return {
          data: post,
        };
      }
      // if user is trying to like the post, create a new like
      else {
        await db.like.create({
          data: {
            post: {
              connect: {
                id: postId,
              },
            },
            author: {
              connect: {
                id: userId,
              },
            },
          },
        });
        console.log("like created");
      }
    }
    const updatedPost = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });

    console.log("updated post", updatedPost);
    return {
      data: updatedPost,
    };
  } catch (e) {
    console.log(e);
    throw Error("Failed to update post like");
  }
};

export const addComment = async (postId, comment) => {
  try {
    const { userId } = auth();
    if (!userId) throw Error("Not authenticated");
    const newComment = await db.comment.create({
      data: {
        comment,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log("comment created", newComment);
    return {
      data: newComment,
    };
  } catch (e) {
    throw e;
  }
};

export const createTrends = async (trends, postId) => {
  try {
    const newTrends = await db.trend.createMany({
      data: trends.map((trend) => ({
        name: trend,
        postId: postId,
      })),
    });
    return {
      data: newTrends,
    };
  } catch (e) {
    throw e;
  }
};

export const getPopularTrends = async () => {
  try {
    const trends = await db.trend.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: "desc",
        },
      },
      take: 3,
    });
    return {
      data: trends,
    };
  } catch (e) {
    throw e;
  }
};

export const deletePost = async (postId) => {
  try {
    const { userId } = auth();
    if (!userId) throw Error("Not authenticated");
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (post.authorId !== userId) {
      return {
        error: "You are not authorized to delete this post",
      };
    }
    await db.post.delete({
      where: {
        id: postId,
      },
    });
    return {
      data: "Post deleted",
    };
  } catch (e) {
    throw e;
  }
};

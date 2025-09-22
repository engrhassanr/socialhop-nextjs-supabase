"use client";
import { Flex, Spin, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import Post from "./Post";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPostsFeed, getPosts } from "@/actions/post";
import { useInView } from "react-intersection-observer";
import { supabase } from "@/lib/supabase";

const Posts = ({ id = "all" }) => {
  // to know when the last element is in view
  const { ref, inView } = useInView();

  // Decide if we should fetch from Supabase directly
  const [useSupabaseMode, setUseSupabaseMode] = useState(() =>
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  // Supabase direct fetching (bootstrap cache only)
  const [sbPosts, setSbPosts] = useState([]);
  const [sbLoading, setSbLoading] = useState(false);
  const [sbError, setSbError] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchFromSupabase = async () => {
      if (!useSupabaseMode) return;
      setSbLoading(true);
      setSbError(null);
      try {
        // Basic fetch from Post table. Adjust select if you expose FKs via PostgREST.
        const query = supabase
          .from("Post")
          .select("*")
          .order("createdAt", { ascending: false })
          .limit(20);

        // Filter by author id when provided (id !== "all")
        const { data, error } =
          id !== "all" ? await query.eq("authorId", id) : await query;

        if (error) throw error;

        // Normalize to match UI expectations minimally
        const normalized = (data || []).map((p) => ({
          ...p,
          likes: [],
          comments: [],
          author: undefined,
        }));
        setSbPosts(normalized);

        // If we have rows, seed react-query cache so mutations work, then switch to API render path
        if (normalized.length) {
          queryClient.setQueryData(["posts", id], {
            pageParams: [undefined],
            pages: [
              {
                data: normalized,
                metaData: { lastCursor: null, hasMore: false },
              },
            ],
          });
          setUseSupabaseMode(false);
        } else {
          console.warn("Supabase returned no posts; falling back to API mode.");
          setUseSupabaseMode(false);
        }
      } catch (e) {
        setSbError(e);
        // On error, fallback to API mode
        console.warn(
          "Supabase error while fetching posts; falling back to API mode.",
          e?.message
        );
        setUseSupabaseMode(false);
      } finally {
        setSbLoading(false);
      }
    };
    fetchFromSupabase();
  }, [useSupabaseMode, id]);

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["posts", id],
    enabled: !useSupabaseMode, // disable API mode if using Supabase directly
    queryFn: async ({ pageParam = "" }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam);
      if (id) params.set("id", id);
      // request all posts in one response
      params.set("all", "true");
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
  });

  // Debug: log fetched pages on the client
  useEffect(() => {
    if (!useSupabaseMode && data) {
      const flat = data.pages?.flatMap((p) => p?.data || []) || [];
      console.log("Fetched posts count:", flat.length);
      if (flat[0]) {
        console.log("First post sample:", {
          id: flat[0].id,
          authorId: flat[0].authorId,
          createdAt: flat[0].createdAt,
          hasMedia: Boolean(flat[0].media),
          likes: flat[0].likes?.length,
          comments: flat[0].comments?.length,
        });
      }
    }
  }, [data, useSupabaseMode]);
  useEffect(() => {
    // if the last element is in view and there is a next page, fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  const checkLastViewRef = (index, page) => {
    if (index === page.data.length - 1) {
      return true;
    } else return false;
  };

  if (useSupabaseMode && sbError) {
    console.error("Supabase posts fetch error:", sbError);
    return (
      <Flex justify="center" align="center" style={{ padding: "2rem" }}>
        <Typography color="error">
          Error loading posts: {sbError.message}
        </Typography>
      </Flex>
    );
  }

  if (!useSupabaseMode && error) {
    console.error("Posts fetch error:", error);
    return (
      <Flex justify="center" align="center" style={{ padding: "2rem" }}>
        <Typography color="error">
          Error loading posts: {error.message}
        </Typography>
      </Flex>
    );
  }

  if (useSupabaseMode && sbLoading) {
    return (
      <Flex vertical align="center" gap={"large"}>
        <Spin />
        <Typography>Loading...</Typography>
      </Flex>
    );
  }

  if (!useSupabaseMode && isLoading) {
    return (
      <Flex vertical align="center" gap={"large"}>
        <Spin />
        <Typography>Loading...</Typography>
      </Flex>
    );
  }

  // We no longer render a separate Supabase list; we seed the cache then use API path

  if (isSuccess) {
    return (
      <Flex vertical gap={"1rem"}>
        {data?.pages?.map((page) =>
          page?.data?.map((post, index) =>
            checkLastViewRef(index, page) ? (
              <div ref={ref} key={post?.id}>
                <Post data={post} queryId={id} />
              </div>
            ) : (
              <div key={post?.id}>
                <Post data={post} queryId={id} />
              </div>
            )
          )
        )}

        {(isLoading || isFetchingNextPage || isFetching) && (
          <Flex vertical align="center" gap={"large"}>
            <Spin />
            <Typography>Loading...</Typography>
          </Flex>
        )}
      </Flex>
    );
  }
};

export default Posts;

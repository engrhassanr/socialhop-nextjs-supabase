"use client";
import { Flex, Spin, Typography } from "antd";
import React, { useEffect } from "react";
import Post from "./Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyPostsFeed, getPosts } from "@/actions/post";
import { useInView } from "react-intersection-observer";

const Posts = ({ id = "all" }) => {
  // to know when the last element is in view
  const { ref, inView } = useInView();

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
    queryFn: async ({ pageParam = "" }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam);
      if (id) params.set("id", id);
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
    if (data) {
      // Flatten and log a concise snapshot
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
  }, [data]);
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

  if (error) {
    return <Typography>Something went wrong</Typography>;
  }

  if (isLoading) {
    return (
      <Flex vertical align="center" gap={"large"}>
        <Spin />
        <Typography>Loading...</Typography>
      </Flex>
    );
  }

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

import { getMyPostsFeed } from "@/actions/post";
import HomeView from "@/sections/home/view/HomeView";
import { ensureCurrentUserInDB } from "@/actions/user";
import { currentUser } from "@clerk/nextjs";
import { QueryClient } from "@tanstack/react-query";

export const metadata = () => {
  return {
    title: `Socialhop`,
    description: `New way to feel freedom`,
  };
};

const HomePage = async () => {
  // Ensure the logged-in Clerk user exists in DB for feed/posting to work
  await ensureCurrentUserInDB();
  // const queryClient = new QueryClient();
  // const user = await currentUser()
  // // get posts
  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ["posts", "all"],
  //   queryFn: ({ pageParam = "" }) => getMyPostsFeed(pageParam),
  //   getNextPageParam: (lastPage) => {
  //     return lastPage?.metaData.lastCursor;
  //   },
  //   enabled: !!user,
  // });

  return <HomeView />;
};

export default HomePage;

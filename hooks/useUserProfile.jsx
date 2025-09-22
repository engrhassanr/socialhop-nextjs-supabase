import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/actions/user";

export const useUserProfile = (userId) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Function to update user data in cache
  const updateUserData = (updates) => {
    queryClient.setQueryData(["user", userId], (prev) => {
      if (!prev) {
        return {
          data: {
            id: userId,
            ...updates,
          },
        };
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          ...updates,
        },
      };
    });
  };

  // Function to update banner specifically
  const updateBanner = (bannerUrl, bannerId) => {
    updateUserData({
      banner_url: bannerUrl,
      banner_id: bannerId,
    });
  };

  // Function to invalidate and refetch user data
  const refreshUserData = () => {
    queryClient.invalidateQueries({
      queryKey: ["user", userId],
    });
  };

  return {
    userData: data,
    isLoading,
    isError,
    error,
    refetch,
    updateUserData,
    updateBanner,
    refreshUserData,
  };
};

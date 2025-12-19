import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase";
import { useAuthStore } from "@/stores/authStore";
import type { UserProfileStats } from "@/types";

export const useUserProfile = (userId: string | undefined) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: profile } = await supabase
        .from("user_profile_stats")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!profile) {
        const { error } = await supabase
          .from("user_profile_stats")
          .insert([{ user_id: userId, favorites: [] }] as never);

        if (error && error.code !== "23505") {
          throw error;
        }
      }

      const { data, error } = await supabase
        .from("user_profile_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        return null;
      }

      const userProfile: UserProfileStats = {
        ...(data as UserProfileStats),
        email: user?.email,
        created_at: user?.created_at,
      };

      return userProfile;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

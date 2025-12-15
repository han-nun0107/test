import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase";
import type { FavoriteItem } from "@/types";

export const useUserFavorites = (userId: string | undefined) => {
  const { data, isLoading } = useQuery({
    queryKey: ["userFavorites", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data: profile } = await supabase
        .from("user_profile_stats")
        .select("favorites")
        .eq("user_id", userId)
        .maybeSingle();

      const items: FavoriteItem[] =
        profile &&
        Array.isArray((profile as { favorites?: unknown[] }).favorites)
          ? ((profile as { favorites: unknown[] }).favorites as FavoriteItem[])
          : [];

      return items;
    },
    enabled: !!userId,
  });

  return {
    favoriteItems: data ?? [],
    isLoading,
  };
};

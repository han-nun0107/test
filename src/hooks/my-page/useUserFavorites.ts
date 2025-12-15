import { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabase/supabase";
import type { FavoriteItem } from "@/types";

export const useUserFavorites = (userId: string | undefined) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!userId) {
      setFavoriteItems([]);
      return;
    }

    const fetchFavorites = async () => {
      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);

      try {
        const { data: profile } = await supabase
          .from("user_profile_stats")
          .select("favorites")
          .eq("user_id", userId)
          .maybeSingle();

        if (abortController.signal.aborted) return;

        const favList =
          profile &&
          Array.isArray((profile as { favorites?: unknown[] }).favorites)
            ? ((profile as { favorites: unknown[] }).favorites as number[])
            : [];

        let favSongTitles: string[] = [];

        if (favList.length > 0) {
          const { data: songs } = await supabase
            .from("onusongdb")
            .select("id, title, artist")
            .in("id", favList.map(Number));

          if (abortController.signal.aborted) return;

          favSongTitles =
            songs?.map(
              (s: { title: string; artist: string }) =>
                `${s.title} — ${s.artist}`,
            ) || [];
        }

        if (abortController.signal.aborted) return;

        const items: FavoriteItem[] = favSongTitles.map((title) => {
          const [song, ...singerParts] = title.split(" — ");
          return {
            song: song.trim(),
            singer: singerParts.join(" — ").trim(),
          };
        });

        setFavoriteItems(items);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error fetching favorites:", error);
          setFavoriteItems([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId]);

  return { favoriteItems, isLoading };
};

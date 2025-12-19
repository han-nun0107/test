import { convertYoutubeToThumbnail } from "@/utils";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useUserFavorites } from "@/hooks";
import type { FavoriteItem } from "@/types";

export function useMusicCard(image: string, title: string, singer: string) {
  const [isCopied, setIsCopied] = useState(false);
  const session = useAuthStore((state) => state.session);
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const { favoriteItems: favorites } = useUserFavorites(userId);

  const isLiked = favorites.some(
    (item) => item.song === title && item.singer === singer,
  );

  const updateFavoritesMutation = useMutation({
    mutationFn: async (updatedFavorites: FavoriteItem[]) => {
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_profile_stats")
        .update({ favorites: updatedFavorites } as never)
        .eq("user_id", userId);

      if (error) throw error;
      return updatedFavorites;
    },
    onSuccess: (updatedFavorites) => {
      queryClient.setQueryData(["userFavorites", userId], updatedFavorites);
    },
    onError: (error) => {
      return error;
    },
  });

  const thumbnail = convertYoutubeToThumbnail(image);

  const handleHeartClick = async () => {
    if (!userId) {
      return;
    }

    const newFavorite: FavoriteItem = { song: title, singer };
    const isAlreadyLiked = favorites.some(
      (item) => item.song === title && item.singer === singer,
    );

    let updatedFavorites: FavoriteItem[];

    if (isAlreadyLiked) {
      updatedFavorites = favorites.filter(
        (item) => !(item.song === title && item.singer === singer),
      );
    } else {
      updatedFavorites = [...favorites, newFavorite];
    }

    updateFavoritesMutation.mutate(updatedFavorites);
  };

  const handleImageClick = async () => {
    const textToCopy = `신청 ${title}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      return err;
    }
  };
  return {
    isLiked,
    isCopied,
    thumbnail,
    handleHeartClick,
    handleImageClick,
  };
}

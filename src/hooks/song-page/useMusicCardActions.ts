import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "@/supabase/supabase";
import { useEditSongStore } from "@/stores/editSongStore";
import type { SongData } from "@/api/songdb";

export const useMusicCardActions = (
  songId?: number,
  songData?: SongData,
  title?: string,
) => {
  const queryClient = useQueryClient();
  const { setSongToEdit } = useEditSongStore();

  const handleEditClick = useCallback(() => {
    if (songData) {
      setSongToEdit(songData);
      setTimeout(() => {
        const editSection = document.getElementById("edit-song-section");
        editSection?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [songData, setSongToEdit]);

  const handleDeleteClick = useCallback(async () => {
    if (!songId) return;
    if (!confirm(`"${title}" 삭제할까요?`)) return;

    const { error } = await supabase
      .from("onusongdb")
      .delete()
      .eq("id", songId);

    if (error) {
      toast.error(error.message || "삭제 중 오류가 발생했습니다.");
      return;
    }

    toast.success("노래가 삭제되었습니다.");
    // 쿼리 무효화 (React Query가 자동으로 refetch함)
    queryClient.invalidateQueries({ queryKey: ["songs"] });
  }, [songId, title, queryClient]);

  return {
    handleEditClick,
    handleDeleteClick,
  };
};

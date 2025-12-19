import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useLayoutStore } from "@/stores/layoutStore";
import { useNavigation } from "@/hooks";
import { useEditModeStore } from "@/stores/editModeStore";
import { supabase } from "@/supabase/supabase";
import type { SongData } from "@/api/songdb";
import { copyToClipboard, logError } from "@/utils";
import { toast } from "react-toastify";

export const useLayoutHandlers = () => {
  const navigate = useNavigate();
  const { closeLeftMenu, toggleContact } = useLayoutStore();
  const { closeSearch } = useLayoutStore();
  const { navigateToAuth } = useNavigation();
  const { toggleEditMode } = useEditModeStore();

  const handleMenuClick = useCallback(
    async (action: string) => {
      closeLeftMenu();
      switch (action) {
        case "edit":
          toggleEditMode();
          break;
        case "login":
          navigate("/login");
          break;
        case "signup":
          navigate("/signup");
          break;
        case "profile":
          navigateToAuth();
          break;
        case "logout":
          try {
            const { error } = await supabase.auth.signOut();
            if (error) {
              throw error;
            }
            toast.success("로그아웃되었습니다.");
          } catch (error) {
            logError("로그아웃", error);
            toast.error("로그아웃 중 오류가 발생했습니다.");
          }
          break;
        case "contact":
          toggleContact();
          break;
      }
    },
    [closeLeftMenu, navigate, navigateToAuth, toggleEditMode, toggleContact],
  );

  const handleSongClick = useCallback(
    async (song: SongData) => {
      const title = song.title || "제목 없음";
      const textToCopy = `신청 ${title}`;
      const uniqueKey =
        song.id ||
        `${song.title || "unknown"}-${song.singer || "unknown"}-${song.thumbnail_url || song.inst || ""}`;
      await copyToClipboard(
        textToCopy,
        `${title}을(를) 복사했습니다.`,
        `copy-${uniqueKey}`,
      );
      closeSearch();
    },
    [closeSearch],
  );

  return {
    handleMenuClick,
    handleSongClick,
  };
};

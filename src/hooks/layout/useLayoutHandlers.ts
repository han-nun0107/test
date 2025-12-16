import { useCallback } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useNavigation } from "@/hooks";
import { useEditModeStore } from "@/stores/editModeStore";
import type { SongData } from "@/api/songdb";
import { copyToClipboard } from "@/utils";

export const useLayoutHandlers = () => {
  const { closeLeftMenu, toggleContact } = useLayoutStore();
  const { closeSearch } = useLayoutStore();
  const { navigateToAuth } = useNavigation();
  const { toggleEditMode } = useEditModeStore();

  const handleMenuClick = useCallback(
    (action: string) => {
      closeLeftMenu();
      switch (action) {
        case "edit":
          toggleEditMode();
          break;
        case "login":
        case "profile":
          navigateToAuth();
          break;
        case "contact":
          toggleContact();
          break;
      }
    },
    [closeLeftMenu, navigateToAuth, toggleEditMode, toggleContact],
  );

  const handleSongClick = useCallback(
    async (song: SongData) => {
      const title = song.title || "제목 없음";
      const textToCopy = `신청 ${title}`;
      await copyToClipboard(textToCopy, `${title}을(를) 복사했습니다.`);
      closeSearch();
    },
    [closeSearch],
  );

  return {
    handleMenuClick,
    handleSongClick,
  };
};

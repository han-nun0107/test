import { useMemo } from "react";
import { useAllSongs, useDebounce } from "@/hooks";
import { fuzzySearchSongs } from "@/utils";

export function useSearchSongs(searchQuery: string) {
  const { data: allSongs, isLoading } = useAllSongs();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const searchResults = useMemo(() => {
    if (!allSongs || !debouncedSearchQuery.trim()) {
      return allSongs || [];
    }

    // Fuse.js를 사용한 유사 검색 (매핑 테이블도 함께 사용)
    return fuzzySearchSongs(allSongs, debouncedSearchQuery);
  }, [allSongs, debouncedSearchQuery]);

  return {
    searchResults,
    isLoading,
    searchQuery: debouncedSearchQuery,
  };
}

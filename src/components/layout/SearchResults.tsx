import { normalizeSinger, normalizeCategories } from "@/utils";
import type { SongData } from "@/api/songdb";

type SearchResultsProps = {
  isLoading: boolean;
  searchQuery: string;
  searchResults: SongData[];
  onSongClick?: (song: SongData) => void;
};

export default function SearchResults({
  isLoading,
  searchQuery,
  searchResults,
  onSongClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6 sm:py-8">
        <div className="text-sm text-gray-400 sm:text-base">검색 중...</div>
      </div>
    );
  }

  if (!searchQuery.trim()) {
    return (
      <div className="flex items-center justify-center py-6 sm:py-8">
        <div className="text-center text-sm text-gray-400 sm:text-base">
          검색어를 입력해주세요
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 sm:py-8">
        <div className="text-center text-sm text-gray-400 sm:text-base">
          검색 결과가 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-2 text-xs text-gray-500 sm:text-sm">
        {searchResults.length}개의 결과
      </div>
      {searchResults.map((song) => {
        const categories = normalizeCategories(song);
        const handleClick = () => {
          onSongClick?.(song);
        };
        return (
          <div
            key={song.id ?? song.key}
            onClick={handleClick}
            className="cursor-pointer rounded-lg border border-gray-200 p-2 transition-colors hover:bg-gray-50 sm:p-3"
          >
            <div className="truncate text-sm font-medium text-gray-800 sm:text-base">
              {song.title || "제목 없음"}
            </div>
            <div className="mt-1 truncate text-xs text-gray-600 sm:text-sm">
              {normalizeSinger(song) || "가수 없음"}
            </div>
            {categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-700 sm:px-2 sm:text-xs"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { normalizeSinger, normalizeCategories } from "@/utils/parseSong";
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
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">검색 중...</div>
      </div>
    );
  }

  if (!searchQuery.trim()) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-gray-400">검색어를 입력해주세요</div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-gray-400">검색 결과가 없습니다</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-2 text-sm text-gray-500">
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
            className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
          >
            <div className="font-medium text-gray-800">
              {song.title || "제목 없음"}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {normalizeSinger(song) || "가수 없음"}
            </div>
            {categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700"
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

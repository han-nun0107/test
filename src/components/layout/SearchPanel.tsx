import { Button } from "@/components";
import { cn } from "@/utils";
import SearchResults from "./SearchResults";
import type { SongData } from "@/api/songdb";

type SearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  searchResults: SongData[];
  isLoading: boolean;
  onSongClick?: (song: SongData) => void;
};

export default function SearchPanel({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onClearSearch,
  searchResults,
  isLoading,
  onSongClick,
}: SearchPanelProps) {
  return (
    <>
      <div
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-full sm:w-96",
          "bg-white shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">검색</h2>
            <Button
              onClick={onClose}
              variant="ICON_BUTTON"
              aria-label="검색 닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="제목, 가수, 태그로 검색..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 pl-8 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none sm:px-4 sm:py-3 sm:pr-10 sm:pl-10 sm:text-base"
              />
              {searchQuery && (
                <Button
                  onClick={onClearSearch}
                  variant="ICON_BUTTON"
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                  aria-label="검색어 지우기"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <SearchResults
              isLoading={isLoading}
              searchQuery={searchQuery}
              searchResults={searchResults}
              onSongClick={onSongClick}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />
      )}
    </>
  );
}

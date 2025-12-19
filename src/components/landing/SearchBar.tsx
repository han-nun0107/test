import { useCallback } from "react";
import { useSearchStore } from "@/stores/searchStore";
import { useToggleStore } from "@/stores/toggleStore";
import { SearchIcon } from "@/constants/layout/icons";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { toggle } = useToggleStore();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  if (toggle !== "song") {
    return null;
  }

  return (
    <div className="w-full max-w-lg">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="제목, 가수, 태그 검색..."
          className="w-full rounded-full border border-blue-200/60 bg-white/80 py-3.5 pr-4 pl-11 text-sm text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 hover:shadow-md focus:border-blue-400 focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-blue-200/50 focus:outline-none"
        />
      </div>
    </div>
  );
}

import type { SongData } from "@/api/songdb";
import type { SortType, FilterType } from "@/stores/sortFilterStore";
import { filterSongs } from "@/utils/songFilters";
import { sortSongs } from "@/utils/songSorters";

export function sortAndFilterSongs(
  songs: SongData[],
  sortType: SortType,
  filterType: FilterType,
): SongData[] {
  const filtered = filterSongs(songs, filterType);
  return sortSongs(filtered, sortType);
}

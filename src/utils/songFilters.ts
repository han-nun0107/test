import type { SongData } from "@/api/songdb";
import type { FilterType } from "@/stores/sortFilterStore";

export function filterSongs(
  songs: SongData[],
  filterType: FilterType,
): SongData[] {
  if (filterType === "completed") {
    return songs.filter((song) => song.completed);
  }
  if (filterType === "recommend") {
    return songs.filter((song) => song.recommend);
  }
  if (filterType === "bomb") {
    return songs.filter((song) => song.bomb);
  }
  if (filterType === "favorite") {
    return songs.filter((song) => song.bomb);
  }
  return songs;
}

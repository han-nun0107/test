import type { SongData } from "@/api/songdb";
import type { SortType } from "@/stores/sortFilterStore";
import { normalizeSinger } from "@/utils/parseSong";

type SortMode = "title" | "singer" | "skill" | "latest";
type SortOrder = "asc" | "desc";

function parseSortType(sortType: SortType): [SortMode, SortOrder] {
  const [mode, order] = sortType.split("-") as [SortMode, SortOrder];
  return [mode, order ?? "asc"];
}

function getSkillRank(notes: string | null | undefined): number {
  if (typeof notes !== "string") return 999;
  if (notes.includes("익숙")) return 0;
  if (notes.includes("반숙")) return 2;
  return 1;
}

export function sortSongs(songs: SongData[], sortType: SortType): SongData[] {
  const [mode, order] = parseSortType(sortType);
  const dir = order === "asc" ? 1 : -1;

  return [...songs].sort((a, b) => {
    let cmp = 0;

    switch (mode) {
      case "title": {
        cmp = (a.title || "").localeCompare(b.title || "", "ko");
        break;
      }
      case "singer": {
        const singerA = normalizeSinger(a);
        const singerB = normalizeSinger(b);
        cmp = singerA.localeCompare(singerB, "ko");
        break;
      }
      case "skill": {
        cmp = getSkillRank(a.notes) - getSkillRank(b.notes);
        break;
      }
      case "latest":
      default: {
        cmp = (a.id || 0) - (b.id || 0);
        break;
      }
    }

    return cmp * dir;
  });
}

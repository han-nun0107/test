import type { SongData } from "@/api/songdb";

function isValidCategory(category: string): boolean {
  if (!category || category.trim().length === 0) return false;
  if (category.trim() === "?") return false;
  return true;
}

export function normalizeCategories(song: SongData): string[] {
  const categories: string[] = [];

  // song.categories 처리
  if (song.categories) {
    if (Array.isArray(song.categories)) {
      categories.push(
        ...song.categories.filter(
          (cat): cat is string =>
            typeof cat === "string" && isValidCategory(cat),
        ),
      );
    } else if (
      typeof song.categories === "string" &&
      isValidCategory(song.categories)
    ) {
      categories.push(song.categories);
    }
  }

  if (song.category) {
    if (Array.isArray(song.category)) {
      categories.push(
        ...song.category.filter(
          (cat): cat is string =>
            typeof cat === "string" && isValidCategory(cat),
        ),
      );
    } else if (
      typeof song.category === "string" &&
      isValidCategory(song.category)
    ) {
      categories.push(song.category);
    }
  }

  if (song.notes) {
    const notesText = song.notes.trim();
    if (notesText) {
      const noteItems = notesText
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && isValidCategory(item));

      noteItems.forEach((item) => {
        if (!categories.includes(item)) {
          categories.push(item);
        }
      });
    }
  }

  return categories;
}

export function normalizeSinger(song: SongData): string {
  return (song.artist || song.singer || "") as string;
}

export function parseSong(song: SongData) {
  return {
    ...song,
    processedCategories: normalizeCategories(song),
    processedSinger: normalizeSinger(song),
  };
}

export function parseSongs(songs: SongData[]) {
  return songs.map(parseSong);
}

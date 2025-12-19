import type { SongData } from "@/api/songdb";
import { normalizeCategories } from "@/utils";

export function mapToCategory(song: SongData): string[] {
  const categories: string[] = [];

  if (song.completed) categories.push("숙제곡");
  if (song.bomb) categories.push("폭탄곡");

  const songCategories = normalizeCategories(song);
  const allText = [
    ...songCategories,
    song.title || "",
    song.singer || "",
    song.notes || "",
  ]
    .join(" ")
    .toLowerCase();

  if (
    allText.includes("jpop") ||
    allText.includes("j-pop") ||
    allText.includes("일본") ||
    allText.includes("japan")
  ) {
    categories.push("JPOP");
  } else if (
    allText.includes("kpop") ||
    allText.includes("k-pop") ||
    allText.includes("한국") ||
    allText.includes("korea")
  ) {
    categories.push("KPOP");
  } else if (allText.includes("acoustic") || allText.includes("어쿠스틱")) {
    categories.push("어쿠스틱");
  }

  if (
    categories.length === 0 ||
    (!categories.includes("JPOP") &&
      !categories.includes("KPOP") &&
      !categories.includes("어쿠스틱"))
  ) {
    categories.push("POP");
  }

  return Array.from(new Set(categories));
}

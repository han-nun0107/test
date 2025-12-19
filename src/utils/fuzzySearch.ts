import Fuse, { type IFuseOptions } from "fuse.js";
import type { SongData } from "@/api/songdb";
import { normalizeSinger, normalizeCategories } from "@/utils/parseSong";
import { expandSearchQuery } from "@/utils/searchMappings";

type SearchableSong = {
  title: string;
  singer: string;
  categories: string;
  originalSong: SongData;
};

function toSearchableSong(song: SongData): SearchableSong {
  const singer = normalizeSinger(song);
  const categories = normalizeCategories(song).join(" ");
  const title = (song.title || "") as string;

  return {
    title,
    singer,
    categories,
    originalSong: song,
  };
}

const fuseOptions: IFuseOptions<SearchableSong> = {
  keys: [
    { name: "title", weight: 0.4 }, // 제목 가중치
    { name: "singer", weight: 0.4 }, // 가수 가중치
    { name: "categories", weight: 0.2 }, // 태그 가중치
  ],
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: false,
};

export function fuzzySearchSongs(songs: SongData[], query: string): SongData[] {
  if (!query.trim()) {
    return songs;
  }

  const searchableSongs = songs.map(toSearchableSong);
  const expandedQueries = expandSearchQuery(query);

  const allResults = new Map<
    string | number,
    { song: SongData; score: number }
  >();

  expandedQueries.forEach((expandedQuery) => {
    // 검색어 길이에 따라 threshold 조정 (더 엄격하게)
    let threshold = 0.2;
    if (expandedQuery.length <= 2) {
      threshold = 0.1; // 매우 짧은 검색어는 매우 엄격하게
    } else if (expandedQuery.length <= 4) {
      threshold = 0.15; // 짧은 검색어는 엄격하게
    }

    const fuse = new Fuse(searchableSongs, {
      ...fuseOptions,
      threshold,
    });

    const results = fuse.search(expandedQuery);

    results.forEach((result) => {
      const song = result.item.originalSong;
      const songKey = song.id ?? song.key;
      const score = result.score ?? 1;
      const normalizedQuery = expandedQuery.toLowerCase();
      const title = result.item.title.toLowerCase();
      const singer = result.item.singer.toLowerCase();
      const categories = result.item.categories.toLowerCase();

      // 확장된 검색어가 제목, 가수, 태그 중 하나라도 포함되는지 확인
      const isMatch =
        title.includes(normalizedQuery) ||
        singer.includes(normalizedQuery) ||
        categories.includes(normalizedQuery) ||
        expandedQueries.some((q) => {
          const normalizedQ = q.toLowerCase();
          return (
            title.includes(normalizedQ) ||
            singer.includes(normalizedQ) ||
            categories.includes(normalizedQ)
          );
        });

      // 매칭되는 경우에만 결과에 추가
      if (isMatch) {
        const existing = allResults.get(songKey);
        if (!existing || score < existing.score) {
          allResults.set(songKey, {
            song,
            score,
          });
        }
      }
    });
  });

  return Array.from(allResults.values())
    .sort((a, b) => a.score - b.score)
    .map((item) => item.song);
}

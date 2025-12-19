import { useMemo } from "react";
import type { SongData } from "@/api/songdb";
import { normalizeSinger } from "@/utils";
import { useGroupedData } from "@/hooks/song-page/useGroupedData";

export const useSinger = (allSongs: SongData[] | undefined) => {
  const extractSingerKey = useMemo(
    () => (song: SongData) => {
      const singerName = normalizeSinger(song);
      return singerName || null;
    },
    [],
  );

  const singers = useGroupedData(allSongs, extractSingerKey);

  return { singers };
};

import {
  normalizeCategories,
  normalizeSinger,
  convertYoutubeToThumbnail,
  getSongTags,
} from "@/utils";
import type { SongData } from "@/api/songdb";

type SongListModalProps = {
  songs: SongData[];
  filterName?: string;
  filterType?: "category" | "singer";
};

export default function SongListModal({
  songs,
  filterName,
  filterType,
}: SongListModalProps) {
  return (
    <div className="custom-scrollbar flex h-auto max-h-[60vh] sm:max-h-[50vh] md:h-150 w-full flex-col gap-4 sm:gap-6 overflow-y-auto">
      <div className="mt-3 sm:mt-5 flex flex-col gap-3 sm:gap-4 px-2 sm:px-0">
        {songs.length === 0 ? (
          <p className="text-gray-500">노래가 없습니다.</p>
        ) : (
          songs.map((song, index) => {
            const songCategories = normalizeCategories(song);
            const singer = normalizeSinger(song);
            const tags = getSongTags(song);

            let mainCategory = "";
            if (filterType === "category" && filterName) {
              const otherCategories = songCategories.filter(
                (cat) => cat !== filterName,
              );
              mainCategory =
                otherCategories.length > 0 ? otherCategories[0] : filterName;
            } else {
              mainCategory = songCategories.length > 0 ? songCategories[0] : "";
            }

            const songThumbnail = convertYoutubeToThumbnail(
              song.thumbnail_url || song.inst || "",
            );

            return (
              <div
                key={song.id || index}
                className="border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0"
              >
                <div className="flex gap-2 sm:gap-3">
                  {songThumbnail && (
                    <img
                      src={songThumbnail}
                      alt={song.title || "노래 이미지"}
                      className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-bold text-[#1f2937] truncate">
                      {song.title || "제목 없음"}
                    </p>
                    <p className="text-xs sm:text-sm text-[#6b7280] truncate">
                      {singer || "가수 미상"}
                    </p>
                    {mainCategory && (
                      <p className="text-[10px] sm:text-xs font-medium text-[#9ca3af] uppercase truncate">
                        {mainCategory}
                      </p>
                    )}
                    {tags.length > 0 && (
                      <p className="text-[10px] sm:text-xs text-[#6b7280] line-clamp-2">
                        {tags.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import {
  normalizeCategories,
  normalizeSinger,
  convertYoutubeToThumbnail,
  getSongTags,
  copyToClipboard,
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
    <div className="custom-scrollbar flex h-auto max-h-[60vh] w-full flex-col gap-4 overflow-y-auto sm:max-h-[50vh] sm:gap-6 md:h-150">
      <div className="mt-3 flex flex-col gap-3 px-2 sm:mt-5 sm:gap-4 sm:px-0">
        {songs.length === 0 ? (
          <p className="text-gray-500">노래가 없습니다.</p>
        ) : (
          songs.map((song) => {
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

            const uniqueKey =
              song.id ||
              `${song.title || "unknown"}-${singer || "unknown"}-${song.thumbnail_url || song.inst || mainCategory || ""}`;

            const handleSongClick = async () => {
              const title = song.title || "제목 없음";
              const textToCopy = `신청 ${title}`;
              await copyToClipboard(
                textToCopy,
                `${title}을(를) 복사했습니다.`,
                `copy-${uniqueKey}`,
              );
            };

            return (
              <div
                key={uniqueKey}
                className="cursor-pointer border-b border-gray-200 pb-3 last:border-b-0 sm:pb-4"
                onClick={handleSongClick}
              >
                <div className="flex gap-2 sm:gap-3">
                  {songThumbnail && (
                    <img
                      src={songThumbnail}
                      alt={song.title || "노래 이미지"}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
                    />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-sm font-bold text-[#1f2937] sm:text-base">
                      {song.title || "제목 없음"}
                    </p>
                    <p className="truncate text-xs text-[#6b7280] sm:text-sm">
                      {singer || "가수 미상"}
                    </p>
                    {mainCategory && (
                      <p className="truncate text-[10px] font-medium text-[#9ca3af] uppercase sm:text-xs">
                        {mainCategory}
                      </p>
                    )}
                    {tags.length > 0 && (
                      <p className="line-clamp-2 text-[10px] text-[#6b7280] sm:text-xs">
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

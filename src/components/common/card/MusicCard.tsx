import { Button, Icon, Tag } from "@/components";
import HeartIcon from "@/assets/icons/heart/heartButton.svg?react";
import FullHeartIcon from "@/assets/icons/heart/fullHeart.svg?react";
import { useMusicCard } from "@/hooks";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/utils";

type MusicCardProps = {
  title: string;
  singer: string;
  categories: string[];
  noteKey: string;
  image: string;
  completed?: boolean;
  recommend?: boolean;
  bomb?: boolean;
  youtubeUrl: string;
};

export default function MusicCard({
  title,
  singer,
  categories,
  noteKey,
  image,
  completed,
  recommend,
  bomb,
  youtubeUrl,
}: MusicCardProps) {
  const { isLiked, isCopied, thumbnail, handleHeartClick, handleImageClick } =
    useMusicCard(image, title);
  const session = useAuthStore((state) => state.session);

  const handleYoutubeClick = () => {
    window.open(youtubeUrl, "_blank");
  };
  return (
    <article className="flex h-auto w-full max-w-[224.4px] min-w-[224.4px] flex-col items-center justify-center">
      <div className="flex h-70 w-full flex-col gap-1.5 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
        <div
          className="group relative aspect-video w-full cursor-pointer overflow-hidden"
          onClick={handleImageClick}
        >
          <div className="relative h-full w-full">
            <img
              src={thumbnail}
              alt="music-card"
              className="pointer-events-none h-full w-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="backdrop-blur-0 pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:backdrop-blur-sm">
            <span className="text-lg font-bold text-white drop-shadow-lg">
              {isCopied ? "✓ 복사됨!" : "클릭하여 복사"}
            </span>
          </div>
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
            {completed && (
              <Tag
                type="badge"
                completed={true}
                className="pointer-events-none"
              />
            )}
            {recommend && (
              <Tag
                type="badge"
                recommend={true}
                className="pointer-events-none"
              />
            )}
            {bomb && (
              <Tag type="badge" bomb={true} className="pointer-events-none" />
            )}
          </div>
        </div>
        <div className="mx-2 mt-2 flex min-w-0 items-center justify-between gap-2 overflow-hidden sm:mx-3">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1 overflow-hidden">
            <p className="min-w-0 truncate text-xs font-bold text-[#1f2937] sm:text-sm">
              {title}
            </p>
            <p className="min-w-0 truncate text-[9px] font-medium text-[#6b7280] sm:text-[10px]">
              {singer}
            </p>
          </div>
          <div
            className={cn(
              !session && "pointer-events-none invisible",
              "ml-2 shrink-0",
            )}
          >
            <Button variant="ICON" onClick={handleHeartClick}>
              <Icon
                icon={isLiked ? FullHeartIcon : HeartIcon}
                size={24}
                className="sm:h-[30px] sm:w-[30px]"
                color="black"
              />
            </Button>
          </div>
        </div>
        {categories.length > 0 && (
          <div className="mx-2 mt-2 flex items-center gap-1 overflow-hidden sm:mx-3">
            {categories.map((cat) => (
              <Tag
                type="tag"
                key={cat}
                className="shrink-0 text-[7px] sm:text-[8px]"
              >
                {cat}
              </Tag>
            ))}
          </div>
        )}
        <div className="mx-2 mt-3 mb-1 flex min-w-0 items-center gap-1 overflow-hidden sm:mx-3 sm:mb-1.5">
          <Button
            variant="MUSIC_CARD"
            onClick={handleYoutubeClick}
            className="min-w-0 shrink text-xs transition-all duration-300 hover:scale-105 sm:text-sm"
          >
            <span className="truncate">INSTRUMENTAL</span>
          </Button>
          {noteKey && (
            <Tag type="note" className="shrink-0 text-xs sm:text-sm">
              {noteKey}
            </Tag>
          )}
        </div>
      </div>
    </article>
  );
}

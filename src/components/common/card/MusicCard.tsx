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
    <article className="flex h-auto sm:h-72 w-full sm:w-58 flex-col items-center justify-center">
      <div className="flex h-full w-full flex-col gap-2 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
        <div
          className="group relative h-40 sm:h-32 w-full cursor-pointer overflow-hidden"
          onClick={handleImageClick}
        >
          <div className="relative h-full w-full bg-gray-200">
            <img
              src={thumbnail}
              alt="music-card"
              className="pointer-events-none h-full w-full object-cover object-center"
              loading="lazy"
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
        <div className="mx-2 sm:mx-3 flex items-center justify-between">
          <div className="flex flex-col items-start justify-center gap-[2px] flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-[#1f2937] truncate w-full">{title}</p>
            <p className="text-[9px] sm:text-[10px] font-medium text-[#6b7280] truncate w-full">{singer}</p>
          </div>
          <div className={cn(!session && "pointer-events-none invisible", "shrink-0 ml-2")}>
            <Button variant="ICON" onClick={handleHeartClick}>
              <Icon
                icon={isLiked ? FullHeartIcon : HeartIcon}
                size={24}
                className="sm:w-[30px] sm:h-[30px]"
                color="black"
              />
            </Button>
          </div>
        </div>
        <div className="mx-2 sm:mx-3">
          <div className="mt-2 flex items-center gap-1 overflow-hidden">
            {categories.map((cat) => (
              <Tag type="tag" key={cat} className="shrink-0 text-[7px] sm:text-[8px]">
                {cat}
              </Tag>
            ))}
          </div>
          <div className="mt-3 sm:mt-5 flex items-center gap-1 flex-wrap">
            <Button
              variant="MUSIC_CARD"
              onClick={handleYoutubeClick}
              className="transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
            >
              INSTRUMENTAL
            </Button>
            <Tag type="note" className="text-xs sm:text-sm">{noteKey}</Tag>
          </div>
        </div>
      </div>
    </article>
  );
}

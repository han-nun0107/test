import { Modal } from "@/components";
import type { SongData } from "@/api/songdb";
import { CategoryModal, SingerModal } from "@/components";

type IndexAnotherCardProps = {
  image: string;
  categories: string[];
  songs?: SongData[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: "category" | "singer";
};

export default function IndexAnotherCard({
  image,
  categories,
  songs = [],
  isOpen,
  setIsOpen,
  type,
}: IndexAnotherCardProps) {
  const categoryName = categories[0] || "";

  return (
    <article className="h-[160px] w-57 sm:h-32">
      <div
        className="relative flex h-[160px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg sm:h-full"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={image}
          alt="카드 이미지"
          width={228}
          height={160}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        <p className="relative z-10 px-2 text-center text-xs font-bold text-[#fafafb] drop-shadow-lg sm:text-sm">
          {categoryName}
        </p>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={categoryName}
      >
        {type === "category" ? (
          <CategoryModal songs={songs} categoryName={categoryName} />
        ) : (
          <SingerModal songs={songs} />
        )}
      </Modal>
    </article>
  );
}

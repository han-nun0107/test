import { Card, Pagination } from "@/components";
import type { FavoriteItem } from "@/types";
import { useUserFavoriteStats } from "@/hooks";

export default function UserFavoritesStats({
  favoriteItems,
}: {
  favoriteItems: FavoriteItem[];
}) {
  const {
    currentPageItems,
    totalPages,
    handlePageChange,
    ITEMS_PER_PAGE,
    currentPage,
  } = useUserFavoriteStats(favoriteItems);

  return (
    <article className="mt-6 sm:mt-8 px-4">
      <h2 className="mb-3 sm:mb-4 text-left text-base sm:text-[1.05rem] font-extrabold text-[#7c3aed]">
        즐겨찾기 곡
      </h2>
      <div className="mt-8 sm:mt-12 flex min-h-[200px] sm:min-h-[325px] flex-col gap-1">
        {currentPageItems.map((item, index) => (
          <Card
            key={index}
            type="favoriteCard"
            data={{ song: item.song, singer: item.singer }}
          />
        ))}
      </div>

      {favoriteItems.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </article>
  );
}

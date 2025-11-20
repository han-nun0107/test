import { Card } from "@/components";

export default function UserFavorite({
  favoriteSingsLength,
}: {
  favoriteSingsLength: number;
}) {
  const MY_PAGE_CARD = [
    {
      count: 0,
      label: "신청곡 수",
      favorite: false,
    },
    {
      count: favoriteSingsLength,
      label: "즐겨찾기",
      favorite: true,
    },
  ];
  return (
    <article className="mt-6 sm:mt-9 flex w-full max-w-[430px] flex-col justify-center px-4">
      <h2 className="mt-4 sm:mt-6 mb-2 text-left text-base sm:text-[1.05rem] font-extrabold text-[#7c3aed]">
        내 신청곡/즐겨찾기 통계
      </h2>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {MY_PAGE_CARD.map((card) => (
          <Card
            type="myPage"
            data={{
              count: card.count,
              label: card.label,
              favorite: card.favorite,
            }}
          />
        ))}
      </div>
    </article>
  );
}

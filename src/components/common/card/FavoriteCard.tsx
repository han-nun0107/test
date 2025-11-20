type FavoriteCardProps = {
  song: string;
  singer: string;
};

export default function FavoriteCard({ song, singer }: FavoriteCardProps) {
  return (
    <article>
      <div className="mb-[0.7rem] flex h-auto min-h-[50px] w-full max-w-108 items-center justify-start rounded-[1.2rem] bg-[#eaeaec] px-3 sm:px-[1.3rem] py-2 sm:py-[0.8rem] text-sm sm:text-[1.01rem] font-medium text-[#334155] shadow-[0_1px_6px_#6366f112]">
        <p className="text-base sm:text-lg font-semibold text-[#334155] truncate w-full">
          {song} - {singer}
        </p>
      </div>
    </article>
  );
}

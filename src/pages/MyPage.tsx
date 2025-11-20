import {
  UserInfo,
  UserFavorite,
  UserFavoritesStats,
} from "@/components/mypage";
import { Button } from "@/components";
import { useAuthStore } from "@/stores/authStore";

export default function Mypage() {
  const userProfile = useAuthStore((state) => state.userProfile) as {
    avatar_url: string;
    email: string;
    created_at: string;
  };
  const FAVORITE_ITEMS = [
    { song: "Song 1", singer: "Singer 1" },
    { song: "Song 2", singer: "Singer 2" },
    { song: "Song 3", singer: "Singer 3" },
    { song: "Song 4", singer: "Singer 4" },
    { song: "Song 5", singer: "Singer 5" },
    { song: "Song 6", singer: "Singer 6" },
  ];

  const favoriteSingsLength = FAVORITE_ITEMS.length;

  return (
    <section className="flex min-h-screen w-screen flex-col items-center justify-center bg-linear-to-br from-[#fdfbfb] to-[#ebedee] p-4">
      <div className="custom-scrollbar flex h-auto max-h-[90vh] sm:h-200 w-full max-w-[95vw] sm:w-118 flex-col items-center overflow-y-auto rounded-2xl sm:rounded-4xl border border-[#a21caf]/14 bg-[#fbfbfb]/70 shadow-[0_8px_40px_rgba(78,205,196,0.09)]">
        <h1 className="mt-6 sm:mt-10 mb-2 animate-[subtleHologram_5s_ease-in-out_infinite] bg-[linear-gradient(45deg,#6366f1,#8b5cf6,#ec4899,#f59e0b)] bg-size-[300%_300%] bg-clip-text text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent">
          내 정보
        </h1>
        <UserInfo user={userProfile ?? {}} />
        <UserFavorite favoriteSingsLength={favoriteSingsLength} />
        <UserFavoritesStats favoriteItems={FAVORITE_ITEMS} />
        <div className="mt-10 sm:mt-25 mb-6 sm:mb-10 flex flex-col items-center justify-center gap-2 px-4">
          <Button variant="MY_PAGE_BUTTON">회원 탈퇴</Button>
          <p className="text-xs text-gray-400 text-center">
            탈퇴 시 모든 정보가 삭제됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

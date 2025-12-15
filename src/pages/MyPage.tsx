import {
  UserInfo,
  UserFavorite,
  UserFavoritesStats,
} from "@/components/mypage";
import { Button } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { useUserFavorites } from "@/hooks";

export default function Mypage() {
  const userProfile = useAuthStore((state) => state.userProfile);
  const userId = useAuthStore((state) => state.user?.id);
  const { favoriteItems } = useUserFavorites(userId);

  const favoriteSingsLength = favoriteItems.length;

  return (
    <section className="flex min-h-screen w-screen flex-col items-center justify-center bg-linear-to-br from-[#fdfbfb] to-[#ebedee] p-4">
      <div className="custom-scrollbar flex h-auto max-h-[90vh] w-full max-w-[95vw] flex-col items-center overflow-y-auto rounded-2xl border border-[#a21caf]/14 bg-[#fbfbfb]/70 shadow-[0_8px_40px_rgba(78,205,196,0.09)] sm:h-200 sm:w-118 sm:rounded-4xl">
        <h1 className="mt-6 mb-2 animate-[subtleHologram_5s_ease-in-out_infinite] bg-[linear-gradient(45deg,#6366f1,#8b5cf6,#ec4899,#f59e0b)] bg-size-[300%_300%] bg-clip-text text-2xl font-extrabold text-transparent sm:mt-10 sm:text-3xl md:text-4xl">
          내 정보
        </h1>
        <UserInfo
          user={
            userProfile ?? {
              avatar_url: "",
              email: "",
              created_at: "",
            }
          }
        />
        <UserFavorite favoriteSingsLength={favoriteSingsLength} />
        <UserFavoritesStats favoriteItems={favoriteItems} />
        <div className="mt-10 mb-6 flex flex-col items-center justify-center gap-2 px-4 sm:mt-25 sm:mb-10">
          <Button variant="MY_PAGE_BUTTON">회원 탈퇴</Button>
          <p className="text-center text-xs text-gray-400">
            탈퇴 시 모든 정보가 삭제됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

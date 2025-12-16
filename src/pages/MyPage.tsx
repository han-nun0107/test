import { useState } from "react";
import { useNavigate } from "react-router";
import {
  UserInfo,
  UserFavorite,
  UserFavoritesStats,
} from "@/components/mypage";
import { Button, Modal, ContactForm } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { useUserFavorites } from "@/hooks";
import { toast } from "react-toastify";

export default function Mypage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const userProfile = useAuthStore((state) => state.userProfile);
  const userId = useAuthStore((state) => state.user?.id);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const { favoriteItems } = useUserFavorites(userId);

  const favoriteSingsLength = favoriteItems.length;

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAccount(userId);

      // 모달 닫기
      setIsDeleteModalOpen(false);

      if (result.success) {
        toast.success("회원 탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        toast.error(result.error || "회원 탈퇴 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setIsDeleteModalOpen(false);
      toast.error("회원 탈퇴 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-linear-to-br from-[#fdfbfb] to-[#ebedee] p-4">
      <div className="custom-scrollbar flex h-auto max-h-[90vh] w-full max-w-[95vw] flex-col items-center overflow-x-hidden overflow-y-auto rounded-2xl border border-[#a21caf]/14 bg-[#fbfbfb]/70 shadow-[0_8px_40px_rgba(78,205,196,0.09)] sm:h-200 sm:w-118 sm:rounded-4xl">
        <div className="mt-6 flex w-full items-center justify-start px-4 sm:mt-10">
          <Button
            variant="ICON_BUTTON"
            onClick={() => navigate("/")}
            className="rounded-full p-2 hover:bg-gray-200"
            aria-label="메인 페이지로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Button>
        </div>
        <h1 className="mb-2 animate-[subtleHologram_5s_ease-in-out_infinite] bg-[linear-gradient(45deg,#6366f1,#8b5cf6,#ec4899,#f59e0b)] bg-size-[300%_300%] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl md:text-4xl">
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
          <Button
            variant="MY_PAGE_BUTTON"
            onClick={() => setIsContactModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            건의사항
          </Button>
          <Button
            variant="MY_PAGE_BUTTON"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            {isDeleting ? "처리 중..." : "회원 탈퇴"}
          </Button>
          <p className="text-center text-xs text-gray-400">
            탈퇴 시 모든 정보가 삭제됩니다.
          </p>
        </div>
      </div>

      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="건의사항"
      >
        <div className="mt-6 w-full max-w-md">
          <ContactForm />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="회원 탈퇴"
        isCloseable={!isDeleting}
      >
        <div className="mt-8 flex w-full flex-col items-center gap-6 sm:mt-10">
          <div className="flex flex-col items-center gap-3">
            <p className="text-center text-base font-semibold text-gray-800 sm:text-lg">
              정말로 회원 탈퇴를 하시겠습니까?
            </p>
            <p className="text-center text-sm leading-relaxed text-gray-600 sm:text-base">
              탈퇴하시면 모든 개인 정보와 즐겨찾기 데이터가
              <br />
              영구적으로 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="MY_PAGE_BUTTON"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full bg-red-500 px-6 py-3 text-base hover:bg-red-600 disabled:bg-red-300 sm:w-auto sm:min-w-[120px]"
            >
              {isDeleting ? "처리 중..." : "탈퇴하기"}
            </Button>
            <Button
              variant="MY_PAGE_BUTTON"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="w-full bg-gray-400 px-6 py-3 text-base hover:bg-gray-500 disabled:bg-gray-300 sm:w-auto sm:min-w-[120px]"
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/supabase/supabase";
import { saveConsentInfo } from "@/utils/consentStorage";
import { toast } from "react-toastify";

export const useLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const session = useAuthStore((state) => state.session);
  const redirectParam = searchParams.get("redirect") || "/";

  // users 테이블에서 회원 존재 여부 확인
  const checkUserExists = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("회원 확인 오류:", error);
          return false;
        }

        return !!data;
      } catch (error) {
        console.error("회원 확인 오류:", error);
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    const verifyAndRedirect = async () => {
      if (session?.user?.id) {
        const userExists = await checkUserExists(session.user.id);

        if (!userExists) {
          // users 테이블에 없으면 로그아웃하고 회원가입 페이지로 이동
          await supabase.auth.signOut();
          toast.error("회원가입이 필요합니다. 회원가입을 진행해주세요.");
          navigate("/signup", { replace: true });
          return;
        }

        // 회원이 존재하면 정상적으로 리다이렉트
        if (redirectParam) {
          navigate(redirectParam, { replace: true });
        }
      }
    };

    verifyAndRedirect();
  }, [session, navigate, redirectParam, checkUserExists]);

  const handleLogin = useCallback(
    async (hasAllConsent: boolean) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        saveConsentInfo(hasAllConsent);

        const redirectUrl = `${window.location.origin}/login?redirect=${encodeURIComponent(redirectParam)}`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
          },
        });

        if (error) {
          setErrorMessage(error.message || "로그인 중 오류가 발생했습니다.");
          setIsLoading(false);
        }
      } catch (error) {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    },
    [redirectParam],
  );

  return { handleLogin, errorMessage, isLoading };
};

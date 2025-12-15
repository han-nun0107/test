import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/supabase/supabase";

export const useLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const session = useAuthStore((state) => state.session);
  const redirectParam = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (session && redirectParam) {
      navigate(redirectParam, { replace: true });
    }
  }, [session, navigate, redirectParam]);

  const handleLogin = async (
    isButtonDisabled: boolean,
    hasAllConsent: boolean,
  ) => {
    if (isButtonDisabled) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      // 모든 동의가 완료된 경우에만 로컬 스토리지에 저장
      if (hasAllConsent) {
        localStorage.setItem(
          "user_consent",
          JSON.stringify({
            consented: true,
            timestamp: new Date().toISOString(),
          }),
        );
      }

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
  };
  return { handleLogin, errorMessage, isLoading };
};

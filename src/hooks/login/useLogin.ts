import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/supabase/supabase";
import { saveConsentInfo } from "@/utils";

export const useLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const session = useAuthStore((state) => state.session);
  const redirectParam = searchParams.get("redirect") || "/";

  useEffect(() => {
    const verifyAndRedirect = async () => {
      if (session?.user?.id) {
        if (redirectParam) {
          navigate(redirectParam, { replace: true });
        }
      }
    };

    verifyAndRedirect();
  }, [session, navigate, redirectParam]);

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

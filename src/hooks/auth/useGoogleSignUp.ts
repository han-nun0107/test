import { useCallback, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { saveConsentInfo } from "@/utils";

export const useGoogleSignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = useCallback(async (hasAllConsent: boolean) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      saveConsentInfo(hasAllConsent);

      const redirectUrl = `${window.location.origin}/signup`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMessage(error.message || "회원가입 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("회원가입 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }, []);

  return { handleGoogleSignUp, errorMessage, isLoading };
};

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "@/supabase/supabase";
import { useAuthStore } from "@/stores/authStore";
import { saveConsentInfo } from "@/utils";
import { toast } from "react-toastify";

export const useEmailLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const redirectParam = searchParams.get("redirect") || "/";
  const createUserRecord = useAuthStore((state) => state.createUserRecord);

  const handleEmailLogin = async (
    email: string,
    password: string,
    hasAllConsent: boolean,
  ) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      saveConsentInfo(hasAllConsent);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMsg = "로그인 중 오류가 발생했습니다.";

        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("Email not confirmed") ||
          error.status === 400
        ) {
          errorMsg =
            "이메일 또는 비밀번호가 올바르지 않습니다. 회원가입을 먼저 진행해주세요.";
        } else {
          errorMsg = error.message || errorMsg;
        }

        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        await createUserRecord(data.user.id);
        toast.success("로그인되었습니다!");
        navigate(redirectParam, { replace: true });
      }
    } catch (error) {
      const message = "로그인 중 오류가 발생했습니다.";
      setErrorMessage(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  return { handleEmailLogin, errorMessage, isLoading };
};

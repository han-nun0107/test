import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/supabase/supabase";
import { useAuthStore } from "@/stores/authStore";
import { saveConsentInfo } from "@/utils";
import { toast } from "react-toastify";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const createUserRecord = useAuthStore((state) => state.createUserRecord);

  const handleSignUp = async (
    email: string,
    password: string,
    hasAllConsent: boolean,
  ) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      saveConsentInfo(hasAllConsent);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "회원가입 중 오류가 발생했습니다.");
        toast.error(error.message || "회원가입 중 오류가 발생했습니다.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        await createUserRecord(data.user.id);
        toast.success("회원가입이 완료되었습니다!");
        navigate("/");
      }
    } catch (error) {
      const message = "회원가입 중 오류가 발생했습니다.";
      setErrorMessage(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  return { handleSignUp, errorMessage, isLoading };
};

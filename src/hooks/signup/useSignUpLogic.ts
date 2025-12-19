import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSignUp, useGoogleSignUp } from "@/hooks";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/supabase/supabase";
import { toast } from "react-toastify";
import type { SignUpMethod } from "@/types/signup/signup";

export const useSignUpLogic = () => {
  const navigate = useNavigate();
  const [ageChecked, setAgeChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [signUpMethod, setSignUpMethod] = useState<SignUpMethod>("email");

  const session = useAuthStore((state) => state.session);
  const {
    handleSignUp,
    errorMessage: emailErrorMessage,
    isLoading: isEmailLoading,
  } = useSignUp();
  const {
    handleGoogleSignUp,
    errorMessage: googleErrorMessage,
    isLoading: isGoogleLoading,
  } = useGoogleSignUp();

  useEffect(() => {
    const handleGoogleSignUpCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reason = urlParams.get("reason");

      if (session?.user?.id && reason === "not_registered") {
        try {
          const { error } = await supabase
            .from("users")
            .insert([{ id: session.user.id }] as never);

          if (error) {
            toast.error("회원가입 중 오류가 발생했습니다.");
            return;
          }

          toast.success("회원가입이 완료되었습니다!");
          navigate("/", { replace: true });
        } catch (error) {
          toast.error("회원가입 중 오류가 발생했습니다.");
        }
      }
    };

    if (session) {
      handleGoogleSignUpCallback();
    }
  }, [session, navigate]);

  const hasAllConsent = useMemo(
    () => ageChecked && consentChecked,
    [ageChecked, consentChecked],
  );

  const isLoading = useMemo(
    () => (signUpMethod === "email" ? isEmailLoading : isGoogleLoading),
    [signUpMethod, isEmailLoading, isGoogleLoading],
  );

  const errorMessage = useMemo(
    () => (signUpMethod === "email" ? emailErrorMessage : googleErrorMessage),
    [signUpMethod, emailErrorMessage, googleErrorMessage],
  );

  const isButtonDisabled = useMemo(
    () => !hasAllConsent || isLoading,
    [hasAllConsent, isLoading],
  );

  const buttonClassName = useMemo(
    () =>
      `${isLoading ? "cursor-wait" : ""} ${hasAllConsent ? "bg-white" : "bg-gray-200/50"}`,
    [isLoading, hasAllConsent],
  );

  const handleEmailSignUp = useCallback(
    async (email: string, password: string) => {
      if (!hasAllConsent) {
        return;
      }
      await handleSignUp(email, password, hasAllConsent);
    },
    [hasAllConsent, handleSignUp],
  );

  const handleGoogleSignUpClick = useCallback(() => {
    if (!hasAllConsent) {
      return;
    }
    handleGoogleSignUp(hasAllConsent);
  }, [hasAllConsent, handleGoogleSignUp]);

  const handleConsentChange = useCallback(
    (key: "ageChecked" | "consentChecked", checked: boolean) => {
      if (key === "ageChecked") {
        setAgeChecked(checked);
      } else {
        setConsentChecked(checked);
      }
    },
    [],
  );

  const handleSignUpMethodChange = useCallback((method: SignUpMethod) => {
    setSignUpMethod(method);
  }, []);

  return {
    ageChecked,
    consentChecked,
    signUpMethod,
    hasAllConsent,
    isLoading,
    errorMessage,
    isButtonDisabled,
    buttonClassName,
    handleEmailSignUp,
    handleGoogleSignUpClick,
    handleConsentChange,
    handleSignUpMethodChange,
  };
};

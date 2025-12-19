import { useMemo, useState, useCallback } from "react";
import { useLogin } from "@/hooks/login/useLogin";
import { useEmailLogin } from "@/hooks";
import { hasConsent, saveConsentInfo } from "@/utils/consentStorage";

type LoginMethod = "email" | "google";

export const useLoginLogic = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [ageChecked, setAgeChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const {
    handleLogin,
    errorMessage: googleErrorMessage,
    isLoading: isGoogleLoading,
  } = useLogin();

  const {
    handleEmailLogin,
    errorMessage: emailErrorMessage,
    isLoading: isEmailLoading,
  } = useEmailLogin();

  // 구글 로그인 시 동의 여부 확인 (loginMethod 변경 시마다 확인)
  const hasGoogleConsent = useMemo(() => {
    if (loginMethod === "google") {
      return hasConsent();
    }
    return false;
  }, [loginMethod]);

  // 구글 로그인 시 모든 체크박스가 체크되었는지 확인
  const hasAllGoogleConsent = useMemo(
    () => ageChecked && consentChecked,
    [ageChecked, consentChecked],
  );

  const isLoading = useMemo(
    () => (loginMethod === "email" ? isEmailLoading : isGoogleLoading),
    [loginMethod, isEmailLoading, isGoogleLoading],
  );

  const errorMessage = useMemo(
    () => (loginMethod === "email" ? emailErrorMessage : googleErrorMessage),
    [loginMethod, emailErrorMessage, googleErrorMessage],
  );

  // 구글 로그인 버튼 비활성화: 동의가 없고 모든 체크박스가 체크되지 않았거나 로딩 중일 때
  const isButtonDisabled = useMemo(() => {
    if (loginMethod === "email") {
      return isLoading;
    }
    // 구글 로그인: 동의가 없으면 모든 체크박스 확인 필요
    if (!hasGoogleConsent && !hasAllGoogleConsent) {
      return true;
    }
    return isLoading;
  }, [loginMethod, isLoading, hasGoogleConsent, hasAllGoogleConsent]);

  const buttonClassName = useMemo(() => {
    if (loginMethod === "email") {
      return `${isLoading ? "cursor-wait" : ""} bg-white`;
    }
    // 구글 로그인: 동의가 없고 모든 체크박스가 체크되지 않았으면 비활성화 스타일
    if (!hasGoogleConsent && !hasAllGoogleConsent) {
      return `${isLoading ? "cursor-wait" : ""} bg-gray-200/50`;
    }
    return `${isLoading ? "cursor-wait" : ""} bg-white`;
  }, [loginMethod, isLoading, hasGoogleConsent, hasAllGoogleConsent]);

  const onEmailSubmit = useCallback(
    async (email: string, password: string) => {
      await handleEmailLogin(email, password, true);
    },
    [handleEmailLogin],
  );

  const onGoogleLogin = useCallback(() => {
    // 동의가 이미 있으면 바로 로그인
    if (hasGoogleConsent) {
      handleLogin(true);
      return;
    }
    // 동의가 없고 모든 체크박스가 체크되었으면 동의 저장 후 로그인
    if (hasAllGoogleConsent) {
      saveConsentInfo(true);
      handleLogin(true);
    }
  }, [handleLogin, hasGoogleConsent, hasAllGoogleConsent]);

  const handleGoogleConsentChange = useCallback(
    (key: "ageChecked" | "consentChecked", checked: boolean) => {
      if (key === "ageChecked") {
        setAgeChecked(checked);
      } else {
        setConsentChecked(checked);
      }
    },
    [],
  );

  const handleLoginMethodChange = useCallback((method: LoginMethod) => {
    setLoginMethod(method);
    // 로그인 방법 변경 시 체크박스 초기화
    setAgeChecked(false);
    setConsentChecked(false);
  }, []);

  return {
    loginMethod,
    isLoading,
    errorMessage,
    isButtonDisabled,
    buttonClassName,
    onEmailSubmit,
    onGoogleLogin,
    handleLoginMethodChange,
    hasGoogleConsent,
    ageChecked,
    consentChecked,
    handleGoogleConsentChange,
  };
};

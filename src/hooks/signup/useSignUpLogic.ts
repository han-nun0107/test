import { useMemo, useState, useCallback } from "react";
import { useSignUp } from "@/hooks";

export const useSignUpLogic = () => {
  const [ageChecked, setAgeChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const { handleSignUp, errorMessage, isLoading } = useSignUp();

  const hasAllConsent = useMemo(
    () => ageChecked && consentChecked,
    [ageChecked, consentChecked],
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

  return {
    ageChecked,
    consentChecked,
    hasAllConsent,
    isLoading,
    errorMessage,
    isButtonDisabled,
    buttonClassName,
    handleEmailSignUp,
    handleConsentChange,
  };
};

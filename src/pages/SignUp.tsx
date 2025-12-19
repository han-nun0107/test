import { memo } from "react";
import { useNavigate } from "react-router";
import { Button, ConsentCheckbox } from "@/components";
import SignUpHeader from "@/components/signup/SignUpHeader";
import SignUpForm from "@/components/signup/SignUpForm";
import SignUpFooter from "@/components/signup/SignUpFooter";
import { useSignUpLogic } from "@/hooks/signup/useSignUpLogic";
import { useSignUpForm } from "@/hooks/signup/useSignUpForm";
import { ArrowLeft } from "lucide-react";
import { CONSENT_CHECKBOXES } from "@/constants/login/loginConstants";

function SignUp() {
  const navigate = useNavigate();
  const {
    ageChecked,
    consentChecked,
    isLoading,
    errorMessage,
    isButtonDisabled,
    buttonClassName,
    handleEmailSignUp,
    handleConsentChange,
  } = useSignUpLogic();

  const {
    register,
    handleSubmit,
    errors,
    emailValidation,
    passwordValidation,
    confirmPasswordValidation,
  } = useSignUpForm();

  const onSubmit = handleSubmit((data) => {
    handleEmailSignUp(data.email, data.password);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-200 via-blue-200 to-purple-300 p-4">
      <main className="glass-container relative flex w-full max-w-lg flex-col items-center gap-4 px-6 py-8 sm:gap-6 sm:px-10 sm:py-10">
        <Button
          variant="ICON"
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center justify-center rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </Button>

        <SignUpHeader />

        <div className="flex w-full flex-col gap-2 text-sm text-gray-800">
          {CONSENT_CHECKBOXES.map((checkbox) => (
            <ConsentCheckbox
              key={checkbox.id}
              id={checkbox.id}
              label={checkbox.label}
              checked={
                checkbox.key === "ageChecked" ? ageChecked : consentChecked
              }
              onChange={(checked) => handleConsentChange(checkbox.key, checked)}
            />
          ))}
        </div>

        <SignUpForm
          onSubmit={onSubmit}
          register={register}
          errors={errors}
          emailValidation={emailValidation}
          passwordValidation={passwordValidation}
          confirmPasswordValidation={confirmPasswordValidation}
          isLoading={isLoading}
          isButtonDisabled={isButtonDisabled}
          buttonClassName={buttonClassName}
        />

        {errorMessage && (
          <div className="mt-1 min-h-[1.8em] text-center text-sm text-rose-500">
            {errorMessage}
          </div>
        )}

        <SignUpFooter />
      </main>
    </div>
  );
}

export default memo(SignUp);

import { useMemo, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import {
  Button,
  Input,
  ConsentCheckbox,
  LoginMethodButton,
} from "@/components";
import GoogleIcon from "@/components/common/GoogleIcon";
import { useSignUp, useGoogleSignUp } from "@/hooks";
import { useAuthStore } from "@/stores/authStore";
import { ArrowLeft, Mail } from "lucide-react";
import {
  CONSENT_CHECKBOXES,
  PRIVACY_INFO_ITEMS,
} from "@/constants/login/loginConstants";

type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpMethod = "email" | "google";

const SIGNUP_METHODS = [
  {
    id: "email",
    label: "회원가입",
    value: "email" as const,
  },
  {
    id: "google",
    label: "Google 회원가입",
    value: "google" as const,
  },
] as const;

const LOGO_URL =
  "https://nng-phinf.pstatic.net/MjAyNTAzMTZfMjMz/MDAxNzQyMDU0NTAyMDY4.VnZJ8y2dPYjw2CmwOlgEcBEjK7fdNWaWFK3gTlx_-XMg.Mfk1lDB-NjByuqHR_q4lpqfuZZISIp67JRPe1Pk5Twwg.PNG/123.png?type=f120_120_na";

export default function SignUp() {
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
      if (session?.user?.id) {
        // 구글 회원가입 후 users 테이블에 자동 생성
        const { createUserRecord } = useAuthStore.getState();
        await createUserRecord(session.user.id);
        navigate("/", { replace: true });
      }
    };

    if (session) {
      handleGoogleSignUpCallback();
    }
  }, [session, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    mode: "onChange",
  });

  const password = watch("password");

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

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      if (!hasAllConsent) {
        return;
      }
      await handleSignUp(data.email, data.password, hasAllConsent);
    },
    [hasAllConsent, handleSignUp],
  );

  const onGoogleSignUp = useCallback(() => {
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

        <img
          src={LOGO_URL}
          alt="온유 ONU 로고"
          className="mb-2 h-16 w-16 rounded-full bg-white/70 shadow-xl ring-2 ring-indigo-200"
        />

        <h1 className="moving-gradient-text mb-1 text-center text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          온유 노래책 회원가입
        </h1>

        <p className="text-center text-xs text-gray-700 sm:text-sm">
          즐겨찾기와 다양한 개인화 기능(추가예정)을 사용해보세요
          <br />
          온유 노래책은 회원가입 후 다음 정보를 수집하며,
          <br />
          서비스 제공 목적 외에는 사용되지 않습니다:
        </p>

        <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700 sm:text-sm">
          {PRIVACY_INFO_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="text-center text-xs text-gray-500">
          자세한 사항은
          <Link
            to="/privacy"
            className="text-indigo-500 underline hover:text-indigo-700"
          >
            개인정보 처리방침
          </Link>
          을 참조하세요.
        </p>

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

        <div className="flex w-full gap-2">
          {SIGNUP_METHODS.map((method) => (
            <LoginMethodButton
              key={method.id}
              id={method.id}
              label={method.label}
              value={method.value}
              isActive={signUpMethod === method.value}
              onClick={() => handleSignUpMethodChange(method.value)}
            />
          ))}
        </div>

        {signUpMethod === "email" ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4"
          >
            <Input
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              error={errors.email?.message}
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "올바른 이메일 형식이 아닙니다",
                },
              })}
            />

            <Input
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              error={errors.password?.message}
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: {
                  value: 6,
                  message: "비밀번호는 최소 6자 이상이어야 합니다",
                },
              })}
            />

            <Input
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "비밀번호 확인을 입력해주세요",
                validate: (value) =>
                  value === password || "비밀번호가 일치하지 않습니다",
              })}
            />

            <Button
              type="submit"
              variant="LOGIN_BUTTON"
              disabled={isButtonDisabled}
              className={`w-full ${buttonClassName}`}
            >
              <div className="flex w-full items-center justify-center gap-2">
                <Mail />
                <span className="text-gray-700">
                  {isLoading ? "회원가입 중..." : "회원가입"}
                </span>
              </div>
            </Button>
          </form>
        ) : (
          <Button
            variant="LOGIN_BUTTON"
            onClick={onGoogleSignUp}
            disabled={isButtonDisabled}
            className={buttonClassName}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white">
              <GoogleIcon size={18} />
            </div>
            <span className="text-sm leading-5 font-medium text-[#1F1F1F]">
              {isLoading ? "회원가입 중..." : "Google 계정으로 가입"}
            </span>
          </Button>
        )}

        {errorMessage && (
          <div className="mt-1 min-h-[1.8em] text-center text-sm text-rose-500">
            {errorMessage}
          </div>
        )}

        <div className="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="text-indigo-500 underline hover:text-indigo-700"
          >
            로그인
          </Link>
        </div>
      </main>
    </div>
  );
}

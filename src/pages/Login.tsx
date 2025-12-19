import { memo } from "react";
import { Button, ConsentCheckbox } from "@/components";
import { LoginMethodButton, EmailLoginForm } from "@/components";
import GoogleIcon from "@/components/common/GoogleIcon";
import { useLoginLogic } from "@/hooks";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import {
  LOGIN_METHODS,
  PRIVACY_INFO_ITEMS,
  CONSENT_CHECKBOXES,
} from "@/constants/login/loginConstants";

const LOGO_URL =
  "https://nng-phinf.pstatic.net/MjAyNTAzMTZfMjMz/MDAxNzQyMDU0NTAyMDY4.VnZJ8y2dPYjw2CmwOlgEcBEjK7fdNWaWFK3gTlx_-XMg.Mfk1lDB-NjByuqHR_q4lpqfuZZISIp67JRPe1Pk5Twwg.PNG/123.png?type=f120_120_na";

function Login() {
  const navigate = useNavigate();
  const {
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
  } = useLoginLogic();

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
          온유 노래책 로그인
        </h1>

        <p className="text-center text-xs text-gray-700 sm:text-sm">
          즐겨찾기와 다양한 개인화 기능(추가예정)을 사용해보세요
          <br />
          물론 로그인하지 않아도 노래책을 사용하실 수 있습니다!
          <br />
          온유 노래책은 로그인 후 다음 정보를 수집하며,
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

        <div className="flex w-full gap-2">
          {LOGIN_METHODS.map((method) => (
            <LoginMethodButton
              key={method.id}
              id={method.id}
              label={method.label}
              value={method.value}
              isActive={loginMethod === method.value}
              onClick={() => handleLoginMethodChange(method.value)}
            />
          ))}
        </div>

        {loginMethod === "email" ? (
          <EmailLoginForm
            onSubmit={onEmailSubmit}
            isLoading={isLoading}
            isButtonDisabled={isButtonDisabled}
            buttonClassName={buttonClassName}
          />
        ) : (
          <>
            {!hasGoogleConsent && (
              <div className="flex w-full flex-col gap-2 text-sm text-gray-800">
                {CONSENT_CHECKBOXES.map((checkbox) => (
                  <ConsentCheckbox
                    key={checkbox.id}
                    id={checkbox.id}
                    label={checkbox.label}
                    checked={
                      checkbox.key === "ageChecked"
                        ? ageChecked
                        : consentChecked
                    }
                    onChange={(checked) =>
                      handleGoogleConsentChange(checkbox.key, checked)
                    }
                  />
                ))}
              </div>
            )}
            <Button
              variant="LOGIN_BUTTON"
              onClick={onGoogleLogin}
              disabled={isButtonDisabled}
              className={buttonClassName}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white">
                <GoogleIcon size={18} />
              </div>
              <span className="text-sm leading-5 font-medium text-[#1F1F1F]">
                {isLoading ? "로그인 중..." : "Google 계정으로 로그인"}
              </span>
            </Button>
          </>
        )}

        {errorMessage && (
          <div className="mt-1 min-h-[1.8em] text-center text-sm text-rose-500">
            {errorMessage}
          </div>
        )}

        <div className="mt-2 text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="text-indigo-500 underline hover:text-indigo-700"
          >
            회원가입
          </Link>
        </div>
      </main>
    </div>
  );
}

export default memo(Login);

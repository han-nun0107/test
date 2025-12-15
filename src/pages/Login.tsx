import { useState } from "react";
import { Button } from "@/components";
import { useLogin } from "@/hooks/login/useLogin";
import { Link } from "react-router";

export default function Login() {
  const [ageChecked, setAgeChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const { handleLogin, errorMessage, isLoading } = useLogin();
  const isButtonDisabled = !(ageChecked && consentChecked) || isLoading;

  // 모든 체크박스가 체크되었는지 확인
  const hasAllConsent = ageChecked && consentChecked;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-200 via-blue-200 to-purple-300 p-4">
      <main className="glass-container flex w-full max-w-lg flex-col items-center gap-4 px-6 py-8 sm:gap-6 sm:px-10 sm:py-10">
        <img
          src="https://nng-phinf.pstatic.net/MjAyNTAzMTZfMjMz/MDAxNzQyMDU0NTAyMDY4.VnZJ8y2dPYjw2CmwOlgEcBEjK7fdNWaWFK3gTlx_-XMg.Mfk1lDB-NjByuqHR_q4lpqfuZZISIp67JRPe1Pk5Twwg.PNG/123.png?type=f120_120_na"
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
          <li>이메일 주소</li>
          <li>닉네임 (이름)</li>
          <li>프로필 이미지 (선택)</li>
          <li>서비스 이용 기록: 신청한 곡, 즐겨찾기 내역, 이용 통계 등</li>
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
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={ageChecked}
              onChange={(e) => setAgeChecked(e.target.checked)}
              className="cursor-pointer accent-indigo-500"
            />
            <span>만 14세 이상입니다.</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="cursor-pointer accent-indigo-500"
            />
            <span>개인정보 수집 및 이용에 동의합니다.</span>
          </label>
        </div>

        <Button
          variant="LOGIN_BUTTON"
          onClick={() => handleLogin(isButtonDisabled, hasAllConsent)}
          disabled={isButtonDisabled}
          className={`${isLoading ? "cursor-wait" : ""} ${ageChecked && consentChecked ? "bg-white" : "bg-gray-200/50"}`}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </div>
          <span className="text-gray-700">
            {isLoading ? "로그인 중..." : "Google로 로그인"}
          </span>
        </Button>

        {errorMessage && (
          <div className="mt-1 min-h-[1.8em] text-center text-sm text-rose-500">
            {errorMessage}
          </div>
        )}
      </main>
    </div>
  );
}

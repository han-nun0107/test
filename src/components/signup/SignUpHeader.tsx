import { memo } from "react";
import { Link } from "react-router";
import { PRIVACY_INFO_ITEMS } from "@/constants/login/loginConstants";
import { LOGO_URL } from "@/constants/signup/signupConstants";

const SignUpHeader = memo(() => {
  return (
    <>
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
    </>
  );
});

SignUpHeader.displayName = "SignUpHeader";

export default SignUpHeader;

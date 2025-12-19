import { memo } from "react";
import { Link } from "react-router";

const SignUpFooter = memo(() => {
  return (
    <div className="mt-2 text-center text-sm text-gray-600">
      이미 계정이 있으신가요?{" "}
      <Link
        to="/login"
        className="text-indigo-500 underline hover:text-indigo-700"
      >
        로그인
      </Link>
    </div>
  );
});

SignUpFooter.displayName = "SignUpFooter";

export default SignUpFooter;

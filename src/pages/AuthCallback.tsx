import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/supabase/supabase";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { toast } from "react-toastify";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const isSignup = urlParams.get("signup") === "true";

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
          toast.error("인증에 실패했습니다.");
          navigate(isSignup ? "/signup" : "/login", { replace: true });
          return;
        }

        if (isSignup) {
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (existingUser) {
            toast.success("이미 회원가입된 계정입니다.");
            navigate("/", { replace: true });
            return;
          }

          navigate("/signup?reason=not_registered", { replace: true });
          return;
        }

        const { data: profile, error } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("회원 확인 오류:", error);
          toast.error("회원 확인 중 오류가 발생했습니다.");
          navigate("/login", { replace: true });
          return;
        }

        if (!profile) {
          await supabase.auth.signOut();
          navigate("/signup?reason=not_registered", { replace: true });
          return;
        }

        navigate("/", { replace: true });
      } catch (error) {
        console.error("인증 콜백 처리 오류:", error);
        toast.error("인증 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    verifyAndRedirect();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingIndicator />
    </div>
  );
}

export default AuthCallback;

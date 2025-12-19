import { memo } from "react";
import { Button } from "@/components";
import GoogleIcon from "@/components/common/GoogleIcon";

type GoogleSignUpButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  isButtonDisabled: boolean;
  buttonClassName: string;
};

const GoogleSignUpButton = memo(
  ({
    onClick,
    isLoading,
    isButtonDisabled,
    buttonClassName,
  }: GoogleSignUpButtonProps) => {
    return (
      <Button
        variant="LOGIN_BUTTON"
        onClick={onClick}
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
    );
  },
);

GoogleSignUpButton.displayName = "GoogleSignUpButton";

export default GoogleSignUpButton;

import { memo } from "react";
import { Button, Input } from "@/components";
import { Mail } from "lucide-react";
import type {
  UseFormRegister,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import type { SignUpFormData } from "@/types/signup/signup";

type SignUpFormProps = {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  emailValidation: RegisterOptions<SignUpFormData, "email">;
  passwordValidation: RegisterOptions<SignUpFormData, "password">;
  confirmPasswordValidation: RegisterOptions<SignUpFormData, "confirmPassword">;
  isLoading: boolean;
  isButtonDisabled: boolean;
  buttonClassName: string;
};

const SignUpForm = memo(
  ({
    onSubmit,
    register,
    errors,
    emailValidation,
    passwordValidation,
    confirmPasswordValidation,
    isLoading,
    isButtonDisabled,
    buttonClassName,
  }: SignUpFormProps) => {
    return (
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <Input
          type="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          error={errors.email?.message}
          {...register("email", emailValidation)}
        />

        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요 (최소 6자)"
          error={errors.password?.message}
          {...register("password", passwordValidation)}
        />

        <Input
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", confirmPasswordValidation)}
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
    );
  },
);

SignUpForm.displayName = "SignUpForm";

export default SignUpForm;

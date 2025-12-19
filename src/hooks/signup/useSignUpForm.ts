import {
  useForm,
  type UseFormRegister,
  type FieldErrors,
  type UseFormHandleSubmit,
  type RegisterOptions,
} from "react-hook-form";
import type { SignUpFormData } from "@/types/signup/signup";

type EmailValidation = RegisterOptions<SignUpFormData, "email">;
type PasswordValidation = RegisterOptions<SignUpFormData, "password">;
type ConfirmPasswordValidation = RegisterOptions<
  SignUpFormData,
  "confirmPassword"
>;

export const useSignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    mode: "onChange",
  });

  const password = watch("password");

  const emailValidation: EmailValidation = {
    required: "이메일을 입력해주세요",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "올바른 이메일 형식이 아닙니다",
    },
  };

  const passwordValidation: PasswordValidation = {
    required: "비밀번호를 입력해주세요",
    minLength: {
      value: 6,
      message: "비밀번호는 최소 6자 이상이어야 합니다",
    },
  };

  const confirmPasswordValidation: ConfirmPasswordValidation = {
    required: "비밀번호 확인을 입력해주세요",
    validate: (value: string) =>
      value === password || "비밀번호가 일치하지 않습니다",
  };

  return {
    register: register as UseFormRegister<SignUpFormData>,
    handleSubmit: handleSubmit as UseFormHandleSubmit<SignUpFormData>,
    errors: errors as FieldErrors<SignUpFormData>,
    emailValidation,
    passwordValidation,
    confirmPasswordValidation,
  };
};

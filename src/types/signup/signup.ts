import type { SignUpMethod } from "@/types/auth/auth";

export type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type { SignUpMethod };

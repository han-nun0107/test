import { useCallback, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

type FormElement = HTMLFormElement;

type UseContactFormReturn = {
  formRef: React.RefObject<FormElement | null>;
  loading: boolean;
  handleSubmit: (e: React.FormEvent<FormElement>) => Promise<boolean>;
};

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;

const MESSAGES = {
  SUCCESS: "메시지가 전송되었습니다.",
  ERROR: "전송 실패",
} as const;

export function useContactForm(): UseContactFormReturn {
  const formRef = useRef<FormElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<FormElement>): Promise<boolean> => {
      e.preventDefault();

      if (!formRef.current) {
        return false;
      }

      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        toast.error("이메일 서비스 설정이 올바르지 않습니다.");
        return false;
      }

      setLoading(true);

      try {
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          formRef.current,
        );

        toast.success(MESSAGES.SUCCESS);
        formRef.current.reset();
        return true;
      } catch (error) {
        console.error("EmailJS 전송 오류:", error);
        toast.error(MESSAGES.ERROR);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    formRef,
    loading,
    handleSubmit,
  };
}

import { useMemo, useState, useCallback } from "react";
import { useContactForm } from "@/hooks/contact/useContactForm";
import Button from "./Button";

const FORM_STYLES = {
  container: "flex flex-col gap-2",
  input:
    "px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  textarea:
    "px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
} as const;

export default function ContactForm() {
  const { formRef, loading, handleSubmit } = useContactForm();
  const [nickname, setNickname] = useState("");

  const currentTime = useMemo(() => new Date().toLocaleString("ko-KR"), []);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      const success = await handleSubmit(e);
      // 폼 전송 성공 시에만 이름 입력 필드 초기화
      if (success) {
        setNickname("");
      }
    },
    [handleSubmit],
  );

  return (
    <form ref={formRef} onSubmit={handleFormSubmit}>
      <div className={FORM_STYLES.container}>
        <input
          type="text"
          name="name"
          placeholder="이름 (선택)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoComplete="off"
          className={FORM_STYLES.input}
          aria-label="이름 입력"
        />
        <input type="hidden" name="title" value={nickname.trim() || "익명"} />

        <input type="hidden" name="time" value={currentTime} />

        <textarea
          name="message"
          placeholder="메시지를 입력하세요"
          required
          rows={6}
          className={FORM_STYLES.textarea}
          aria-label="메시지 입력"
        />

        <Button type="submit" disabled={loading} variant="SUBMIT_BUTTON">
          {loading ? "전송 중..." : "보내기"}
        </Button>
      </div>
    </form>
  );
}

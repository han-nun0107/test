import { toast } from "react-toastify";

export async function copyToClipboard(
  text: string,
  successMessage: string,
  toastId?: string | number,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage, {
      toastId: toastId || text,
    });
  } catch (error) {
    toast.error("복사에 실패했습니다. 다시 시도해주세요.", {
      toastId: toastId ? `error-${toastId}` : `error-${text}`,
    });
  }
}

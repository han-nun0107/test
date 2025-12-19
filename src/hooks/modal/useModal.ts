import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/utils";

type UseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isCloseable?: boolean;
};

export const useModal = ({
  isOpen,
  onClose,
  isCloseable = true,
}: UseModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const scrollState = lockScroll();

    const handleEsc = (e: KeyboardEvent) => {
      if (isCloseable && e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      unlockScroll(scrollState);
    };
  }, [isOpen, onClose, isCloseable]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCloseable && e.target === e.currentTarget) onClose();
  };

  const handleClose = () => {
    if (isCloseable) onClose();
  };

  return {
    handleOverlayClick,
    handleClose,
  };
};

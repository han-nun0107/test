import CloseIcon from "@/assets/icons/modal/close.svg?react";
import { Button, Icon, Portal } from "@/components";
import { PORTAL_CONTAINER_ID } from "@/constants";
import { Z_INDEX } from "@/foundations";
import { useModal } from "@/hooks";
import { cn } from "@/utils";
import { type ReactNode } from "react";
import FocusLock from "react-focus-lock";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  isCloseable?: boolean;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  isCloseable = true,
  className,
}: ModalProps) => {
  const { handleOverlayClick, handleClose } = useModal({
    isOpen,
    onClose,
    isCloseable,
  });

  if (!isOpen) return null;

  return (
    <Portal containerId={PORTAL_CONTAINER_ID.MODAL}>
      <div
        onClick={handleOverlayClick}
        className="fixed inset-0 flex items-center justify-center bg-black/25 p-4"
        style={{ zIndex: Z_INDEX.MODAL }}
      >
        <FocusLock>
          <div
            role="dialog"
            aria-modal="true"
            {...(title && { "aria-labelledby": "modal-title" })}
            className={cn(
              "relative flex w-[90vw] max-w-170 flex-col items-center rounded-[20px] bg-white px-4 py-8 sm:px-6 sm:py-12 md:px-[40px] md:py-[100px]",
              className,
            )}
            style={{ zIndex: Z_INDEX.MODAL }}
          >
            {title && (
              <h2
                id="modal-title"
                className="text-center text-xl font-bold whitespace-pre-wrap text-[#333] sm:text-2xl md:text-[32px]"
              >
                {title}
              </h2>
            )}
            {children}
            {isCloseable && (
              <Button
                type="button"
                variant="MODAL_CLOSE"
                aria-label="닫기"
                onClick={handleClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-8"
              >
                <Icon icon={CloseIcon} size={24} />
              </Button>
            )}
          </div>
        </FocusLock>
      </div>
    </Portal>
  );
};

export default Modal;

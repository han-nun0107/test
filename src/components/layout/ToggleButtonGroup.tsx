import { useEffect, useRef } from "react";
import { Button } from "@/components";
import { cn } from "@/utils";

type ToggleButton = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

type ToggleButtonGroupProps = {
  buttons: ToggleButton[];
  isExpanded: boolean;
  onToggle: () => void;
};

export default function ToggleButtonGroup({
  buttons,
  isExpanded,
  onToggle,
}: ToggleButtonGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && buttonsRef.current) {
      const firstButton = buttonsRef.current.querySelector("button");
      firstButton?.focus();
    }
  }, [isExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isExpanded) {
      onToggle();
    }
  };

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      <div
        ref={containerRef}
        className="fixed right-2 bottom-2 sm:right-4 sm:bottom-4 z-50 flex flex-col items-end gap-2 sm:gap-3 md:right-8 md:bottom-6"
        onKeyDown={handleKeyDown}
      >
        <div
          ref={buttonsRef}
          className={cn(
            "flex flex-col gap-2 transition-all duration-300 ease-out",
            isExpanded
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0",
          )}
        >
          {buttons.map((button, index) => (
            <Button
              key={button.id}
              onClick={button.onClick}
              variant="FLOATING_TOGGLE"
              className={cn(
                "min-w-[100px] sm:min-w-[120px] justify-start text-sm sm:text-base",
                button.active &&
                  "border-indigo-400 bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-md shadow-indigo-500/20",
                !button.active && "hover:bg-gray-50",
                "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none",
              )}
              style={{
                animationDelay: isExpanded ? `${index * 30}ms` : "0ms",
                transform: isExpanded
                  ? "translateX(0) scale(1)"
                  : "translateX(20px) scale(0.9)",
              }}
              aria-label={button.label}
            >
              {button.icon && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {button.icon}
                </span>
              )}
              <span className="truncate">{button.label}</span>
            </Button>
          ))}
        </div>

        <Button
          onClick={onToggle}
          variant="FLOATING_TOGGLE_EXPAND"
          className={cn(
            "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none",
            isExpanded && "rotate-45",
          )}
          aria-label={isExpanded ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isExpanded}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Button>
      </div>
    </>
  );
}

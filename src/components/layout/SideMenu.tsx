import { Button } from "@/components";
import { CloseIcon } from "@/constants/layout/icons";
import { cn } from "@/utils";
import type { SideMenuProps } from "@/types";

export default function SideMenu({
  isOpen,
  onClose,
  menuItems,
}: SideMenuProps) {
  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 sm:w-80",
          "bg-white shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">메뉴</h2>
            <Button
              onClick={onClose}
              variant="ICON_BUTTON"
              aria-label="메뉴 닫기"
            >
              <CloseIcon />
            </Button>
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                onClick={item.onClick}
                variant="MENU_ITEM"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />
      )}
    </>
  );
}

import { Button } from "@/components";
import { cn } from "@/utils";

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
};

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <Button key={index} onClick={item.onClick} variant="MENU_ITEM">
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

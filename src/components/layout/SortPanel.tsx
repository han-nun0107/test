import { Button } from "@/components";
import { cn } from "@/utils";
import { useSortFilterStore, type SortType } from "@/stores/sortFilterStore";

type SortPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sortOptions: Array<{ type: SortType; label: string }> = [
  { type: "latest-desc", label: "최신순 (내림차순)" },
  { type: "latest-asc", label: "최신순 (오름차순)" },
  { type: "title-asc", label: "노래 제목 순 (오름차순)" },
  { type: "title-desc", label: "노래 제목 순 (내림차순)" },
  { type: "singer-asc", label: "가수 이름 (오름차순)" },
  { type: "singer-desc", label: "가수 이름 (내림차순)" },
  { type: "skill-asc", label: "숙련도 순 (오름차순)" },
  { type: "skill-desc", label: "숙련도 순 (내림차순)" },
];

export default function SortPanel({ isOpen, onClose }: SortPanelProps) {
  const { sortType, setSortType } = useSortFilterStore();

  const handleSortClick = (type: SortType) => {
    setSortType(type);
    onClose();
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-full sm:w-80",
          "bg-white shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">정렬</h2>
            <Button
              onClick={onClose}
              variant="ICON_BUTTON"
              aria-label="정렬 닫기"
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

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.type}
                  onClick={() => handleSortClick(option.type)}
                  variant="MENU_ITEM"
                  className={cn(
                    "w-full justify-start",
                    sortType === option.type &&
                      "border-indigo-300 bg-indigo-50 text-indigo-700",
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />
      )}
    </>
  );
}

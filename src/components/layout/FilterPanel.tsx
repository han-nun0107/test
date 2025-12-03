import { Button } from "@/components";
import { cn } from "@/utils";
import { useSortFilterStore, type FilterType } from "@/stores/sortFilterStore";

type FilterPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const filterOptions: Array<{ type: FilterType; label: string }> = [
  { type: "completed", label: "완곡" },
  { type: "recommend", label: "추천" },
  { type: "bomb", label: "폭탄" },
  { type: "favorite", label: "즐겨찾기" },
  { type: null, label: "필터해제" },
];

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { filterType, setFilterType, reset } = useSortFilterStore();

  const handleFilterClick = (type: FilterType) => {
    if (type === null) {
      reset();
    } else {
      setFilterType(type);
    }
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
            <h2 className="text-xl font-bold text-gray-800">필터</h2>
            <Button
              onClick={onClose}
              variant="ICON_BUTTON"
              aria-label="필터 닫기"
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
              {filterOptions.map((option) => (
                <Button
                  key={option.type ?? "reset"}
                  onClick={() => handleFilterClick(option.type)}
                  variant="MENU_ITEM"
                  className={cn(
                    "w-full justify-start",
                    filterType === option.type &&
                      option.type !== null &&
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

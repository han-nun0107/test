import NextIcon from "@/assets/icons/pagination/next.svg?react";
import PrevIcon from "@/assets/icons/pagination/prev.svg?react";
import { Button, Icon } from "@/components";
import { usePagination } from "@/hooks/pagination/usePagination";
import { cn } from "@/utils/cn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  const { pages, onPagePrevious, onPageNext } = usePagination({
    currentPage,
    totalPages,
    onPageChange,
  });

  return (
    <nav
      aria-label="pagination"
      className={cn("flex items-center justify-center gap-2 sm:gap-4", className)}
    >
      {/* 이전 버튼 */}
      <Button
        variant="ICON"
        aria-label="이전 페이지"
        onClick={onPagePrevious}
        disabled={currentPage === 1}
      >
        <Icon
          icon={PrevIcon}
          size={24}
          color={currentPage === 1 ? "#E0E0E0" : "#8b5cf6"}
        />
      </Button>

      {/* 페이지 목록 */}
      <ol className="flex gap-1 sm:gap-2">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <li key={`dots-${idx}`}>
                <span className="px-2 text-gray-700 select-none">...</span>
              </li>
            );
          }

          return (
            <li key={page}>
              <Button
                aria-label={`${page} 페이지`}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page as number)}
                variant="PAGINATION"
                className={cn(
                  page === currentPage &&
                    "bg-[#8b5cf6] font-semibold text-white",
                )}
              >
                {page}
              </Button>
            </li>
          );
        })}
      </ol>

      {/* 다음 버튼 */}
      <Button
        variant="ICON"
        aria-label="다음 페이지"
        onClick={onPageNext}
        disabled={currentPage === totalPages}
      >
        <Icon
          icon={NextIcon}
          size={24}
          color={currentPage === totalPages ? "#E0E0E0" : "#8b5cf6"}
        />
      </Button>
    </nav>
  );
};

export default Pagination;

import { cn } from "@/utils";

type TagProps =
  | {
      type: "badge";
      completed?: boolean;
      recommend?: boolean;
      bomb?: boolean;
      className?: string;
    }
  | {
      type: "tag";
      children: React.ReactNode;
      className?: string;
    }
  | {
      type: "note";
      children: React.ReactNode;
      className?: string;
    };

// 텍스트 매핑
const badgeTextMap = {
  complete: "완곡",
  recommend: "추천",
  bomb: "💣",
} as const;

export default function Tag(props: TagProps) {
  const { className } = props;

  if (props.type === "badge") {
    const { completed, recommend, bomb } = props;

    const variantStyles = {
      complete: "bg-[#86c227] ",
      recommend: "bg-gradient-to-br from-[#f59e0b] to-[#d97706] ",
      bomb: "bg-[#E52B2D] ",
    };

    let activeVariant: "complete" | "recommend" | "bomb" | null = null;
    if (bomb) {
      activeVariant = "bomb";
    } else if (recommend) {
      activeVariant = "recommend";
    } else if (completed) {
      activeVariant = "complete";
    }

    if (!activeVariant) {
      return null;
    }

    return (
      <div
        className={cn(
          "inline-flex h-[14px] w-8 items-center justify-center rounded-md py-2.5 text-[9px] font-bold text-white",
          variantStyles[activeVariant],
          className,
        )}
      >
        {badgeTextMap[activeVariant]}
      </div>
    );
  }

  if (props.type === "note") {
    return (
      <div
        className={cn(
          "inline-flex h-5 min-w-fit items-center justify-center rounded-lg border border-[#6366f1]/20 px-1.5 text-sm font-bold text-[#6366f1]",
          className,
        )}
      >
        {props.children}
      </div>
    );
  }

  const { children } = props;
  return (
    <div
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-md border border-[#6366f1]/20 px-1.5 font-bold text-[#6366f1]",
        className,
      )}
    >
      {children}
    </div>
  );
}

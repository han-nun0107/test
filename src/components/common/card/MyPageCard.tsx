import { cn } from "@/utils/cn";

type MyPageCardProps = {
  count: number;
  label: string;
  favorite?: boolean;
};

export default function MyPageCard({
  count,
  label,
  favorite,
}: MyPageCardProps) {
  return (
    <div className="flex h-14 sm:h-16 w-full sm:w-52 flex-col items-center justify-center gap-1 rounded-lg bg-white/50 shadow px-2">
      <p
        className={cn(
          "text-base sm:text-lg font-bold",
          favorite ? "text-pink-500" : "text-indigo-500",
        )}
      >
        {count || 0}
      </p>
      <p className="text-xs sm:text-sm text-gray-600 text-center">{label}</p>
    </div>
  );
}

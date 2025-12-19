import { cn } from "@/utils";

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
    <div className="flex h-14 w-full flex-col items-center justify-center gap-1 rounded-lg bg-white/50 px-2 shadow sm:h-16 sm:w-52">
      <p
        className={cn(
          "text-base font-bold sm:text-lg",
          favorite ? "text-pink-500" : "text-indigo-500",
        )}
      >
        {count || 0}
      </p>
      <p className="text-center text-xs text-gray-600 sm:text-sm">{label}</p>
    </div>
  );
}

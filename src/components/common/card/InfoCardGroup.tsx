import type { InfoCardGroupData } from "@/types";
import { getDescriptionClassName, getDescriptionStyle } from "@/utils";

type InfoCardProps = {
  data: InfoCardGroupData;
};

const TITLE_TO_ID_MAP: Record<string, string> = {
  "총 곡수": "total-songs",
  "🎙️신청방법": "total-categories",
  "💣곡 안내": "total-artists",
} as const;

export default function InfoCardGroup({ data }: InfoCardProps) {
  const {
    number,
    numberColor = "text-indigo-600",
    title,
    description,
    subDescription,
    descriptionColor,
  } = data;

  const elementId = TITLE_TO_ID_MAP[title];

  return (
    <article className="mb-4 w-full sm:mb-10 sm:w-auto">
      <div className="flex h-auto min-h-[100px] w-full flex-col items-center justify-center rounded-lg bg-white/70 px-3 py-4 shadow-xl transition-transform duration-300 ease-out will-change-transform hover:scale-105 sm:h-30 sm:w-71 sm:rounded-xl sm:px-3 sm:py-4">
        {number !== undefined && (
          <div
            className={`text-base font-black sm:text-lg ${numberColor}`}
            id={elementId}
          >
            {number}
          </div>
        )}
        <div className="mt-2 text-center text-sm font-bold text-[#374151] sm:text-base">
          {title}
        </div>
        {description && (
          <div
            className={`${getDescriptionClassName(descriptionColor)} mt-2 text-center text-[10px] font-bold sm:text-xs`}
            style={getDescriptionStyle(descriptionColor)}
          >
            {description}
          </div>
        )}
        {subDescription && (
          <div className="mt-[2px] text-center text-[9px] font-semibold text-[#1f2937] sm:text-[10px]">
            {subDescription}
          </div>
        )}
      </div>
    </article>
  );
}

import { TOGGLE } from "@/constants";
import { Button } from "@/components";
import type { ToggleItem } from "@/types";
import { cn } from "@/utils";

type ToggleProps = {
  toggle: ToggleItem["type"];
  setToggle: (toggle: ToggleItem["type"]) => void;
};

export default function Toggle({ toggle, setToggle }: ToggleProps) {
  const activeIndex = TOGGLE.findIndex((item) => item.type === toggle);
  const itemWidth = 100 / TOGGLE.length;

  return (
    <div className="relative flex h-9 sm:h-10 w-full max-w-[95vw] sm:w-95 items-center justify-center rounded-[99px] border border-[#6366F1]/40 bg-[#ffffff]">
      <div
        className="absolute top-0 left-0 h-full rounded-[99px] bg-[linear-gradient(45deg,rgba(99,102,241,0.30),rgba(139,92,246,0.23),rgba(236,72,153,0.18),rgba(245,158,11,0.13))] transition-all duration-500 ease-in-out"
        style={{
          width: `${itemWidth}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {TOGGLE.map((toggles) => (
        <Button
          key={toggles.type}
          onClick={() => setToggle(toggles.type)}
          variant="TOGGLE"
          className={cn(
            "relative z-10 transition-colors duration-500 ease-in-out",
            toggle === toggles.type ? "text-[#1a1a1b]/70" : "text-[#bdbdbd]",
          )}
        >
          {toggles.label}
        </Button>
      ))}
    </div>
  );
}

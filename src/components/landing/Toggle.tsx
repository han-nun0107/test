import { useMemo, useCallback } from "react";
import { TOGGLE } from "@/constants";
import {
  TOGGLE_CONTAINER_CLASSES,
  TOGGLE_INDICATOR_CLASSES,
  TOGGLE_BUTTON_BASE_CLASSES,
  TOGGLE_BUTTON_ACTIVE_CLASSES,
  TOGGLE_BUTTON_INACTIVE_CLASSES,
} from "@/constants/landing/toggleStyles";
import { Button } from "@/components";
import { cn } from "@/utils";
import type { ToggleProps, ToggleItem } from "@/types";

export default function Toggle({ toggle, setToggle }: ToggleProps) {
  const activeIndex = useMemo(
    () => TOGGLE.findIndex((item) => item.type === toggle),
    [toggle],
  );
  const itemWidth = useMemo(() => 100 / TOGGLE.length, []);

  const handleToggleClick = useCallback(
    (type: ToggleItem["type"]) => {
      setToggle(type);
    },
    [setToggle],
  );

  return (
    <div className={TOGGLE_CONTAINER_CLASSES}>
      <div
        className={TOGGLE_INDICATOR_CLASSES}
        style={{
          width: `${itemWidth}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {TOGGLE.map((toggles) => (
        <Button
          key={toggles.type}
          onClick={() => handleToggleClick(toggles.type)}
          variant="TOGGLE"
          className={cn(
            TOGGLE_BUTTON_BASE_CLASSES,
            toggle === toggles.type
              ? TOGGLE_BUTTON_ACTIVE_CLASSES
              : TOGGLE_BUTTON_INACTIVE_CLASSES,
          )}
        >
          {toggles.label}
        </Button>
      ))}
    </div>
  );
}

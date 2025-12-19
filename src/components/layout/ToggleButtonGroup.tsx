import { Button } from "@/components";
import { cn } from "@/utils";

type ToggleButton = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

type ToggleButtonGroupProps = {
  buttons: ToggleButton[];
};

const buttonGradients = [
  "from-green-400 to-blue-500",
  "from-purple-400 to-blue-500",
  "from-pink-400 to-orange-400",
];

export default function ToggleButtonGroup({
  buttons,
}: ToggleButtonGroupProps) {
  return (
    <div className="fixed right-2 bottom-2 z-50 flex flex-col items-center gap-3 sm:right-4 sm:bottom-4 md:right-8 md:bottom-6">
      {buttons.map((button, index) => {
        const gradient = buttonGradients[index] || "from-gray-400 to-gray-500";
        return (
          <Button
            key={button.id}
            onClick={button.onClick}
            variant="TOGGLE_BUTTON"
            className={cn(gradient, button.active && "ring-4 ring-white/50")}
            aria-label={button.label}
          >
            {button.icon}
          </Button>
        );
      })}
    </div>
  );
}

import { cn } from "@/lib/utils.ts";
import { X } from "lucide-react";

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function NodeDeleteButton(props: Props) {
  return (
    <button
      className={cn(
        "absolute -top-2 -right-2 w-6 h-6 border-1 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer",
        "bg-red-200 text-red-600 border-red-600",
        "hover:bg-red-300",
      )}
      onClick={props.onClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <X size={12} />
    </button>
  );
}

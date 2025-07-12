import * as React from "react";
import { cn } from "@/lib/utils.ts";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-16 h-16 border-4 border-t-4 border-gray-200 border-t-gray-600 rounded-full animate-spin",
          className,
        )}
        {...rest}
      />
    );
  },
);

Spinner.displayName = "Spinner";

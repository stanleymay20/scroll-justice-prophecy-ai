
import React from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface ButtonXsProps extends ButtonProps {
  size?: "xs" | "default" | "sm" | "lg" | "icon";
}

export const ButtonXs = React.forwardRef<HTMLButtonElement, ButtonXsProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          {
            "h-7 rounded-md px-2 text-xs": size === "xs",
          },
          className
        )}
        {...props}
      />
    );
  }
);

ButtonXs.displayName = "ButtonXs";


import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl";
  intensity?: "light" | "medium" | "heavy";
  border?: boolean;
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  blur = "md",
  intensity = "medium",
  border = true,
  glow = false,
  className,
  children,
  ...props
}) => {
  const blurMapping = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const intensityMapping = {
    light: "bg-white/5",
    medium: "bg-white/10",
    heavy: "bg-white/15",
  };

  return (
    <div
      className={cn(
        blurMapping[blur],
        intensityMapping[intensity],
        border && "border border-white/10",
        glow && "premium-glow",
        "rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

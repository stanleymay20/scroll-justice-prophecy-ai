
import { cn } from "@/lib/utils";

interface PulseEffectProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PulseEffect({
  color = "bg-justice-primary",
  size = "md",
  className,
}: PulseEffectProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <span className="relative flex">
      <span
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          color
        )}
      ></span>
      <span
        className={cn(
          "relative inline-flex rounded-full",
          color,
          sizeClasses[size],
          className
        )}
      ></span>
    </span>
  );
}

export default PulseEffect;

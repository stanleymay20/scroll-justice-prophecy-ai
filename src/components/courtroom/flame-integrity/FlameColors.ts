
import { FlameIntegrityLevel } from "./types";

export const getFlameColor = (flameLevel: FlameIntegrityLevel): string => {
  switch (flameLevel) {
    case "pure": return "text-green-400";
    case "stable": return "text-emerald-400";
    case "wavering": return "text-yellow-400";
    case "compromised": return "text-orange-500";
    case "critical": return "text-red-500";
    default: return "text-justice-primary";
  }
};

export const getProgressColor = (flameLevel: FlameIntegrityLevel): string => {
  switch (flameLevel) {
    case "pure": return "bg-green-400";
    case "stable": return "bg-emerald-400";
    case "wavering": return "bg-yellow-400";
    case "compromised": return "bg-orange-500";
    case "critical": return "bg-red-500";
    default: return "bg-justice-primary";
  }
};


import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark"); // Default to dark mode

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // In a real implementation, this would update the theme throughout the app
    // For now we'll stay in dark mode as that's what the app is designed for
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-9 h-9 p-0 rounded-full",
        theme === "dark" ? "bg-justice-dark/50" : "bg-justice-light/20",
        className
      )}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;

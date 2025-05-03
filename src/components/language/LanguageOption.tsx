
import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LanguageCode } from "@/contexts/language";

interface LanguageOptionProps {
  code: LanguageCode;
  name: string;
  flag: string;
  isSelected: boolean;
  onSelect: (code: LanguageCode) => void;
}

export function LanguageOption({ code, name, flag, isSelected, onSelect }: LanguageOptionProps) {
  return (
    <DropdownMenuItem 
      key={code}
      onClick={() => onSelect(code)}
      className={`flex items-center gap-2 ${isSelected ? "bg-justice-primary/20" : ""}`}
    >
      <span>{flag}</span>
      <span>{name}</span>
      {isSelected && (
        <span className="ml-auto text-justice-primary text-xs">✓</span>
      )}
    </DropdownMenuItem>
  );
}

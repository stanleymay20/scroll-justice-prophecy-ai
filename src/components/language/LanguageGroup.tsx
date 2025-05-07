
import React from "react";
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { LanguageCode } from "@/contexts/language";

export interface LanguageItem {
  code: LanguageCode;
  name: string;
  flag: string;
  group: "primary" | "extended" | "sacred";
}

export interface LanguageGroupProps {
  title: string;
  languages: LanguageItem[];
  currentLanguage: LanguageCode;
  onLanguageSelect: (code: LanguageCode) => void;
}

export function LanguageGroup({ 
  title, 
  languages, 
  currentLanguage, 
  onLanguageSelect 
}: LanguageGroupProps) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      {languages.map((lang) => (
        <DropdownMenuItem
          key={lang.code}
          className="flex items-center justify-between cursor-pointer"
          onClick={() => onLanguageSelect(lang.code)}
        >
          <div className="flex items-center gap-2">
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </div>
          {currentLanguage === lang.code && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
}

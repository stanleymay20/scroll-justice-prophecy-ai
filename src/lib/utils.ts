
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LanguageCode } from "@/contexts/LanguageContext"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add language-specific class to elements
export function withLanguageClass(language: LanguageCode, ...classes: ClassValue[]) {
  return twMerge(clsx(classes, `lang-${language}`))
}

// Format dates according to the current language
export function formatLocalDate(date: Date, language: LanguageCode): string {
  return new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Format numbers according to the current language
export function formatLocalNumber(num: number, language: LanguageCode): string {
  return new Intl.NumberFormat(language).format(num);
}

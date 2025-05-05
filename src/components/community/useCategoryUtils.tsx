
import { MessageSquare, ScrollText } from "lucide-react";
import { PostCategory } from "@/types/community";
import { useLanguage } from "@/contexts/language";

export function useCategoryUtils() {
  const { t } = useLanguage();
  
  const getCategoryIcon = (category: PostCategory) => {
    switch (category) {
      case "testimony": return <ScrollText className="h-4 w-4" />;
      case "prayer_request": return <ScrollText className="h-4 w-4" />;
      case "legal_question": return <MessageSquare className="h-4 w-4" />;
      case "righteous_insight": return <ScrollText className="h-4 w-4" />;
      case "announcement": return <ScrollText className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  const getCategoryLabel = (category: PostCategory): string => {
    switch (category) {
      case "testimony": return t("community.categories.testimony") || "Testimony";
      case "prayer_request": return t("community.categories.prayerRequest") || "Prayer Request";
      case "legal_question": return t("community.categories.legalQuestion") || "Legal Question";
      case "righteous_insight": return t("community.categories.righteousInsight") || "Righteous Insight";
      case "announcement": return t("community.categories.announcement") || "Announcement";
      default: return category;
    }
  };
  
  return {
    getCategoryIcon,
    getCategoryLabel
  };
}

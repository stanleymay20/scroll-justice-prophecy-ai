
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCategory } from "@/types/community";
import { useLanguage } from "@/contexts/language";

interface CategoryTabsProps {
  activeTab: PostCategory | "all";
  onTabChange: (value: PostCategory | "all") => void;
  children: React.ReactNode;
}

export function CategoryTabs({ activeTab, onTabChange, children }: CategoryTabsProps) {
  const { t } = useLanguage();
  
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={value => onTabChange(value as any)}>
      <TabsList className="mb-8">
        <TabsTrigger value="all">{t("community.allPosts") || "All Posts"}</TabsTrigger>
        <TabsTrigger value="testimony">{t("community.categories.testimony") || "Testimonies"}</TabsTrigger>
        <TabsTrigger value="legal_question">{t("community.categories.legalQuestion") || "Legal Questions"}</TabsTrigger>
        <TabsTrigger value="prayer_request">{t("community.categories.prayerRequest") || "Prayer Requests"}</TabsTrigger>
        <TabsTrigger value="righteous_insight">{t("community.categories.righteousInsight") || "Righteous Insights"}</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab}>
        {children}
      </TabsContent>
    </Tabs>
  );
}

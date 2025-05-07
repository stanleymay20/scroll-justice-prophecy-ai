
import React, { useState, useEffect } from "react";
import { PostCard } from "./PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { CommunityPost, PostType } from "@/types/community";
import { useLanguage } from "@/contexts/language";

export const CommunityFeed = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [activeTab, setActiveTab] = useState<PostType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts(activeTab);
  }, [posts, activeTab]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id(username, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Map the data to include the username and avatar from the profiles relation
        const formattedPosts = data.map(post => {
          const username = post.profiles?.username || "Anonymous";
          const avatar_url = post.profiles?.avatar_url || null;
          
          return {
            ...post,
            username,
            avatar_url,
          } as unknown as CommunityPost;
        });

        setPosts(formattedPosts);
        setFilteredPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: t("feed.fetchError"),
        description: t("feed.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = (category: PostType) => {
    if (category === "all") {
      setFilteredPosts(posts);
      return;
    }
    
    const filtered = posts.filter(post => post.category === category);
    setFilteredPosts(filtered);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as PostType);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all">{t("categories.all")}</TabsTrigger>
          <TabsTrigger value="testimony">{t("categories.testimony")}</TabsTrigger>
          <TabsTrigger value="legal_question">{t("categories.legal")}</TabsTrigger>
          <TabsTrigger value="prayer_request">{t("categories.prayer")}</TabsTrigger>
          <TabsTrigger value="righteous_insight">{t("categories.insight")}</TabsTrigger>
          <TabsTrigger value="announcement">{t("categories.announcement")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("feed.noPosts")}
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </TabsContent>
        
        {["testimony", "legal_question", "prayer_request", "righteous_insight", "announcement"].map(
          category => (
            <TabsContent key={category} value={category} className="mt-4 space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("feed.noPostsInCategory", { category: t(`categories.${category}`) })}
                </div>
              ) : (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
};

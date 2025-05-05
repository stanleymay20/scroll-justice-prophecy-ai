
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Post, PostCategory } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { ErrorDisplay } from "./ErrorDisplay";
import { CategoryTabs } from "./CategoryTabs";
import { PostList } from "./PostList";
import { CreatePostDialog } from "./CreatePostDialog";
import { useCategoryUtils } from "./useCategoryUtils";
import { Database } from "@/integrations/supabase/types";

export function CommunityForum() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PostCategory | "all">("all");
  const { getCategoryIcon, getCategoryLabel } = useCategoryUtils();
  
  useEffect(() => {
    fetchPosts();
  }, [activeTab]);
  
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the new edge function to fix post queries and avoid RLS issues
      const { data, error } = await supabase.functions.invoke("fix-post-queries", {
        body: { category: activeTab }
      });
      
      if (error) {
        console.error("Error invoking fix-post-queries function:", error);
        throw new Error(t("error.postsFetch") || "Error fetching posts");
      }
      
      if (!data || !data.success) {
        console.error("Error in fix-post-queries response:", data?.error);
        throw new Error(data?.error || t("error.postsFetch") || "Error fetching posts");
      }
      
      if (!data.posts || data.posts.length === 0) {
        setPosts([]);
        return;
      }
      
      setPosts(data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError((err as Error).message || t("error.general"));
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: PostCategory | "all") => {
    setActiveTab(value);
  };

  const handleCreatePostClick = () => {
    document.querySelector<HTMLButtonElement>('[aria-label="Create new post"]')?.click();
  };

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">{t("community.title") || "ScrollJustice Community"}</h2>
            <p className="text-muted-foreground mt-2">
              {t("community.description") || "Share testimonies, ask questions, and connect with fellow scroll witnesses"}
            </p>
          </div>
          <CreatePostDialog onPostCreated={fetchPosts} />
        </div>
        
        <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange}>
          {error && <ErrorDisplay error={error} />}
          
          <PostList 
            posts={posts}
            loading={loading}
            error={error}
            activeTab={activeTab}
            onCreatePost={handleCreatePostClick}
            onPostsUpdate={fetchPosts}
            getCategoryIcon={getCategoryIcon}
            getCategoryLabel={getCategoryLabel}
          />
        </CategoryTabs>
      </div>
    </div>
  );
}

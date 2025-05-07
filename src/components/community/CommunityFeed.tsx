import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { PostCard } from './PostCard';
import { CommunityPost, PostType } from '@/types/community';

interface CommunityFeedProps {
  initialFilter?: PostType;
  showCreateButton?: boolean;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  initialFilter = 'all',
  showCreateButton = true,
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostType>(initialFilter);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        const mappedPosts: CommunityPost[] = data.map((post) => ({
          id: post.id,
          user_id: post.user_id,
          username: post.profiles?.username || 'Anonymous',
          avatar_url: post.profiles?.avatar_url || undefined,
          title: post.title,
          content: post.content,
          category: post.category as PostType,
          created_at: post.created_at || new Date().toISOString(),
          updated_at: post.updated_at || new Date().toISOString(),
          likes: post.likes || 0,
          comments_count: post.comments_count || 0,
        }));

        setPosts(mappedPosts);
        filterPosts(mappedPosts, activeFilter);
      }
    } catch (error) {
      console.error('Unexpected error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = (allPosts: CommunityPost[], filter: PostType) => {
    if (filter === 'all') {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(allPosts.filter((post) => post.category === filter));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts(posts, activeFilter);
  }, [activeFilter, posts]);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value as PostType);
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
      <Tabs defaultValue="all" onValueChange={handleFilterChange}>
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

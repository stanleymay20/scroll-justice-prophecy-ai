import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";
import { supabase } from '@/integrations/supabase/client';
import { Post } from '@/types/community';

interface PostListProps {
  category?: string;
}

export function PostList({ category }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: String(error),
      });
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, [category]);
  
  // Fix for the update likes method to use object instead of array
  const updateLikes = async (postId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          likes: currentLikes + 1 
        })
        .eq('id', postId);
    
      if (error) throw error;
    
      // Refresh the posts after liking
      fetchPosts();
    } catch (error) {
      console.error('Error updating post likes:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: String(error),
      });
    }
  };
  
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id} className="bg-black/20 border border-justice-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-white">{post.title}</div>
                <div className="text-xs text-justice-light">{t('community.postedBy')} ScrollJustice</div>
              </div>
            </div>
            <p className="text-sm text-justice-light mb-4">{post.content}</p>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => updateLikes(post.id, post.likes || 0)}
              >
                <Heart className="h-4 w-4 mr-2" />
                {post.likes || 0} {t('community.likes')}
              </Button>
              <Link to={`/community/post/${post.id}`} className="text-justice-primary hover:underline">
                {t('community.viewMore')}
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

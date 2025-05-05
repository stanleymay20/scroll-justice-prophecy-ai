
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Post, PostCategory } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";
import { PostUpdate } from "@/types/supabaseHelpers";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  activeTab: PostCategory | "all";
  onCreatePost: () => void;
  onPostsUpdate: () => void;
  getCategoryIcon: (category: PostCategory) => JSX.Element;
  getCategoryLabel: (category: PostCategory) => string;
}

export function PostList({ 
  posts, 
  loading, 
  error, 
  activeTab, 
  onCreatePost, 
  onPostsUpdate,
  getCategoryIcon,
  getCategoryLabel 
}: PostListProps) {
  const { t } = useLanguage();
  
  const handleLike = async (postId: string, currentLikes: number = 0) => {
    const user = supabase.auth.getUser();
    if (!user) {
      toast({
        title: t("auth.required") || "Authentication Required",
        description: t("auth.signInToLike") || "You must be signed in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData: PostUpdate = { 
        likes: currentLikes + 1 
      };
      
      const { error: updateError } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId);

      if (updateError) {
        console.error("Supabase error liking post:", updateError);
        throw new Error(t("error.likePost") || "Error liking post");
      }
      
      // Update local state by calling the parent refresh function
      onPostsUpdate();
    } catch (err) {
      console.error("Error liking post:", err);
      toast({
        title: t("error.title") || "Error",
        description: t("error.likePost") || "Failed to like this post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-pulse bg-muted rounded-full h-12 w-12 mb-4"></div>
        <p className="text-muted-foreground">{t("app.loading") || "Loading posts..."}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{t("community.noPosts") || "No posts found"}</h3>
        <p className="text-muted-foreground mb-6">{t("community.beFirst") || "Be the first to share in this category"}</p>
        <Button onClick={onCreatePost}>{t("community.createPost") || "Create Post"}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between">
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <div className="flex items-center px-2 py-1 rounded bg-muted/50">
                {getCategoryIcon(post.category)}
                <span className="ml-1 text-xs">{getCategoryLabel(post.category)}</span>
              </div>
            </div>
            <CardDescription className="flex items-center">
              <span>By {post.username}</span>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(new Date(post.created_at || ''), { addSuffix: true })}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{post.content}</p>
          </CardContent>
          <Separator />
          <CardFooter className="pt-3">
            <div className="flex items-center space-x-4 text-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={() => handleLike(post.id, post.likes)}
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments_count}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

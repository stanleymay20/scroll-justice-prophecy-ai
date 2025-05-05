
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments_count: number;
  category: "testimony" | "prayer_request" | "legal_question" | "righteous_insight" | "announcement";
  username?: string;
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (category?: "testimony" | "prayer_request" | "legal_question" | "righteous_insight" | "announcement") => {
    try {
      let query = supabase.from('posts').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Fetch usernames for each post
        const postsWithUsernames = await Promise.all(
          data.map(async (post) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', post.user_id)
              .single();
            
            return {
              ...post,
              username: profileData?.username || 'Anonymous User'
            };
          })
        );
        
        setPosts(postsWithUsernames);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get current post
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      // Update post likes
      const { error } = await supabase
        .from('posts')
        .update({ likes: post.likes + 1 })
        .eq('id', postId);
      
      if (error) throw error;
      
      // Update local state
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={() => fetchPosts()} 
          variant="outline"
          size="sm"
        >
          All
        </Button>
        <Button 
          onClick={() => fetchPosts("testimony")} 
          variant="outline"
          size="sm"
        >
          Testimonies
        </Button>
        <Button 
          onClick={() => fetchPosts("prayer_request")} 
          variant="outline"
          size="sm"
        >
          Prayer Requests
        </Button>
        <Button 
          onClick={() => fetchPosts("legal_question")} 
          variant="outline"
          size="sm"
        >
          Legal Questions
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p>No posts found. Be the first to share!</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-2">
                <Avatar>
                  <AvatarFallback>{post.username?.charAt(0) || 'U'}</AvatarFallback>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.username}`} />
                </Avatar>
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.username} • {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="ml-12">
                <p className="whitespace-pre-line">{post.content}</p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp className="h-4 w-4" /> 
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> 
                  <span>{post.comments_count}</span>
                </Button>
              </div>
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {post.category.replace('_', ' ')}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollText, MessageSquare, Heart, Clock } from "lucide-react";
import { Post, PostCategory } from "@/types/community";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

export function CommunityForum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PostCategory | "all">("all");
  
  useEffect(() => {
    fetchPosts();
  }, [activeTab]);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          id, 
          user_id,
          title,
          content,
          category,
          created_at,
          updated_at,
          likes,
          comments_count,
          profiles (username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(25);
      
      if (activeTab !== "all") {
        query = query.eq('category', activeTab);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedPosts: Post[] = data?.map(post => ({
        id: post.id,
        user_id: post.user_id,
        // Fix: Access the first item in the profiles array or use a default value
        username: post.profiles && post.profiles[0]?.username || 'Anonymous Witness',
        title: post.title,
        content: post.content,
        category: post.category as PostCategory,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes: post.likes,
        comments_count: post.comments_count
      })) || [];
      
      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
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
  
  const getCategoryLabel = (category: PostCategory) => {
    switch (category) {
      case "testimony": return "Testimony";
      case "prayer_request": return "Prayer Request";
      case "legal_question": return "Legal Question";
      case "righteous_insight": return "Righteous Insight";
      case "announcement": return "Announcement";
      default: return category;
    }
  };
  
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Scroll Witness Community</h2>
            <p className="text-muted-foreground mt-2">
              Share testimonies, ask questions, and connect with fellow scroll witnesses
            </p>
          </div>
          <Button>
            New Post
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={value => setActiveTab(value as any)}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="testimony">Testimonies</TabsTrigger>
            <TabsTrigger value="legal_question">Legal Questions</TabsTrigger>
            <TabsTrigger value="prayer_request">Prayer Requests</TabsTrigger>
            <TabsTrigger value="righteous_insight">Righteous Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-pulse bg-muted rounded-full h-12 w-12 mb-4"></div>
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <ScrollText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-6">Be the first to share in this category</p>
                <Button>Create Post</Button>
              </div>
            ) : (
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
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{post.content}</p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <Button variant="ghost" size="sm" className="gap-1">
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

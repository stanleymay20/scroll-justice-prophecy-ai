
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
import { ScrollText, MessageSquare, Heart, Clock, Plus, Send, X } from "lucide-react";
import { Post, PostCategory } from "@/types/community";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export function CommunityForum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PostCategory | "all">("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>("testimony");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
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
        username: post.profiles?.[0]?.username || 'Anonymous Witness',
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
      toast({
        title: "Error",
        description: "Failed to load community posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to create a post.",
        variant: "destructive",
      });
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your post.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory
        });

      if (error) throw error;

      // Clear form and close dialog
      setNewPostTitle("");
      setNewPostContent("");
      setIsDialogOpen(false);
      
      // Add log for sacred audit purposes
      await supabase.from('scroll_witness_logs').insert({
        user_id: user.id,
        action: 'create_post',
        details: `Created ${newPostCategory} post: ${newPostTitle}`
      });
      
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community.",
      });
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLike = async (postId: string, currentLikes: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', postId);

      if (error) throw error;
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like this post. Please try again.",
        variant: "destructive",
      });
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
            <h2 className="text-3xl font-bold">ScrollJustice Community</h2>
            <p className="text-muted-foreground mt-2">
              Share testimonies, ask questions, and connect with fellow scroll witnesses
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts, questions, or testimony with the ScrollJustice community.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-category" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={newPostCategory}
                      onValueChange={(value) => setNewPostCategory(value as PostCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="testimony">Testimony</SelectItem>
                        <SelectItem value="prayer_request">Prayer Request</SelectItem>
                        <SelectItem value="legal_question">Legal Question</SelectItem>
                        <SelectItem value="righteous_insight">Righteous Insight</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="post-title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter a title for your post"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="post-content" className="text-right mt-2">
                    Content
                  </Label>
                  <Textarea
                    id="post-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="col-span-3"
                    rows={5}
                    placeholder="Share your thoughts, questions, or testimony..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex items-center">
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={submitting || !newPostTitle.trim() || !newPostContent.trim()}
                  className="flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" /> 
                  {submitting ? "Posting..." : "Post"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <Button onClick={() => setIsDialogOpen(true)}>Create Post</Button>
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

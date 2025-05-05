
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
import { ScrollText, MessageSquare, Heart, Clock, Plus, Send, X, AlertCircle } from "lucide-react";
import { Post, PostCategory } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/language";

export function CommunityForum() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      toast({
        title: t("error.title") || "Error",
        description: t("error.postsFetch") || "Failed to load community posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: t("auth.required") || "Authentication Required",
        description: t("auth.signInToPost") || "You must be signed in to create a post.",
        variant: "destructive",
      });
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: t("error.missingInfo") || "Missing Information",
        description: t("error.titleAndContent") || "Please provide both title and content for your post.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          // Don't need to set these as they have defaults in the DB
          // likes: 0,
          // comments_count: 0
        });

      if (error) {
        console.error("Supabase error creating post:", error);
        throw new Error(t("error.postCreate") || "Error creating post");
      }

      // Clear form and close dialog
      setNewPostTitle("");
      setNewPostContent("");
      setIsDialogOpen(false);
      
      toast({
        title: t("success.postCreated") || "Post Created",
        description: t("success.postShared") || "Your post has been shared with the community.",
      });
      
      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: t("error.title") || "Error",
        description: t("error.postCreate") || "Failed to create your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLike = async (postId: string, currentLikes: number = 0) => {
    if (!user) {
      toast({
        title: t("auth.required") || "Authentication Required",
        description: t("auth.signInToLike") || "You must be signed in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Cast postId to any to bypass type checking temporarily 
      // This is a workaround until we properly establish UUID types
      const { error } = await supabase
        .from('posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', postId as any);

      if (error) {
        console.error("Supabase error liking post:", error);
        throw new Error(t("error.likePost") || "Error liking post");
      }
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: (post.likes || 0) + 1 } 
          : post
      ));
    } catch (err) {
      console.error("Error liking post:", err);
      toast({
        title: t("error.title") || "Error",
        description: t("error.likePost") || "Failed to like this post. Please try again.",
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>{t("community.newPost") || "New Post"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t("community.createPost") || "Create New Post"}</DialogTitle>
                <DialogDescription>
                  {t("community.createDescription") || "Share your thoughts, questions, or testimony with the ScrollJustice community."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-category" className="text-right">
                    {t("community.category") || "Category"}
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={newPostCategory}
                      onValueChange={(value) => setNewPostCategory(value as PostCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("community.selectCategory") || "Select a category"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="testimony">{t("community.categories.testimony") || "Testimony"}</SelectItem>
                        <SelectItem value="prayer_request">{t("community.categories.prayerRequest") || "Prayer Request"}</SelectItem>
                        <SelectItem value="legal_question">{t("community.categories.legalQuestion") || "Legal Question"}</SelectItem>
                        <SelectItem value="righteous_insight">{t("community.categories.righteousInsight") || "Righteous Insight"}</SelectItem>
                        <SelectItem value="announcement">{t("community.categories.announcement") || "Announcement"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-title" className="text-right">
                    {t("community.title") || "Title"}
                  </Label>
                  <Input
                    id="post-title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="col-span-3"
                    placeholder={t("community.titlePlaceholder") || "Enter a title for your post"}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="post-content" className="text-right mt-2">
                    {t("community.content") || "Content"}
                  </Label>
                  <Textarea
                    id="post-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="col-span-3"
                    rows={5}
                    placeholder={t("community.contentPlaceholder") || "Share your thoughts, questions, or testimony..."}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex items-center">
                  <X className="h-4 w-4 mr-2" /> {t("button.cancel") || "Cancel"}
                </Button>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={submitting || !newPostTitle.trim() || !newPostContent.trim()}
                  className="flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" /> 
                  {submitting ? (t("community.posting") || "Posting...") : (t("button.post") || "Post")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={value => setActiveTab(value as any)}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">{t("community.allPosts") || "All Posts"}</TabsTrigger>
            <TabsTrigger value="testimony">{t("community.categories.testimony") || "Testimonies"}</TabsTrigger>
            <TabsTrigger value="legal_question">{t("community.categories.legalQuestion") || "Legal Questions"}</TabsTrigger>
            <TabsTrigger value="prayer_request">{t("community.categories.prayerRequest") || "Prayer Requests"}</TabsTrigger>
            <TabsTrigger value="righteous_insight">{t("community.categories.righteousInsight") || "Righteous Insights"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("error.title") || "Error"}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-pulse bg-muted rounded-full h-12 w-12 mb-4"></div>
                <p className="text-muted-foreground">{t("app.loading") || "Loading posts..."}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <ScrollText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("community.noPosts") || "No posts found"}</h3>
                <p className="text-muted-foreground mb-6">{t("community.beFirst") || "Be the first to share in this category"}</p>
                <Button onClick={() => setIsDialogOpen(true)}>{t("community.createPost") || "Create Post"}</Button>
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

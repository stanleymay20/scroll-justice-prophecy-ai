import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { PostCategory } from "@/types/community";
import { useLanguage } from "@/contexts/language";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Send, X } from "lucide-react";
import { PostInsert } from "@/types/supabaseHelpers";

interface CreatePostDialogProps {
  onPostCreated: () => void;
}

export function CreatePostDialog({ onPostCreated }: CreatePostDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>("testimony");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

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
      // Create properly typed post data
      const postData: PostInsert = {
        user_id: user.id,
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory
      };

      const { error } = await supabase
        .from('posts')
        .insert([postData]); // Insert expects an array of records

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
      onPostCreated();
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" aria-label="Create new post">
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
  );
}

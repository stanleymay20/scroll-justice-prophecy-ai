
// This is a simplified template, as we don't have the full component code
// Adjust the imports and implementation based on the actual component
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostInsert, PostCategory } from '@/types/community';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  userId: string;
}

export function CreatePostDialog({ isOpen, onClose, onPostCreated, userId }: CreatePostDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('testimony');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your post.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost: PostInsert = {
        title,
        content,
        category,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('posts')
        .insert(newPost);

      if (error) throw error;

      toast({
        title: "Post Created",
        description: "Your post has been published successfully.",
      });

      // Reset form
      setTitle('');
      setContent('');
      setCategory('testimony');
      onPostCreated();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to Create Post",
        description: "There was an error publishing your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value as PostCategory)}
          >
            <option value="testimony">Testimony</option>
            <option value="prayer_request">Prayer Request</option>
            <option value="legal_question">Legal Question</option>
            <option value="righteous_insight">Righteous Insight</option>
            <option value="announcement">Announcement</option>
          </select>
          
          <Textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

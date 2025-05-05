import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";
import { supabase } from "@/lib/supabase";

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export function CreatePostDialog({ open, onClose, onPostCreated }: CreatePostDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "testimony",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  // Fix the insert operation by ensuring we're passing a proper object not an array
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('community.fillAllFields'),
      });
      setSubmitting(false);
      return;
    }
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('posts')
        .insert({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          user_id: userData.user?.id
        });
    
    if (error) throw error;
    
    toast({
      title: t('community.postCreated'),
      description: t('community.postSuccess'),
    });
    
    onClose();
    onPostCreated();
  } catch (error) {
    console.error('Error creating post:', error);
    toast({
      variant: 'destructive',
      title: t('common.error'),
      description: String(error),
    });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('community.createPost')}</DialogTitle>
          <DialogDescription>
            {t('community.shareThoughts')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {t('community.title')}
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              {t('community.category')}
            </Label>
            <Select onValueChange={handleCategoryChange} defaultValue={formData.category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('community.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="testimony">{t('community.testimony')}</SelectItem>
                <SelectItem value="prayer_request">{t('community.prayerRequest')}</SelectItem>
                <SelectItem value="legal_question">{t('community.legalQuestion')}</SelectItem>
                <SelectItem value="righteous_insight">{t('community.righteousInsight')}</SelectItem>
                <SelectItem value="announcement">{t('community.announcement')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right">
              {t('community.content')}
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t('common.submitting') : t('community.createPost')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

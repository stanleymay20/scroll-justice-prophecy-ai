
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Calendar, User } from "lucide-react";
import { CommunityPost } from "./CommunityFeed";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: CommunityPost;
  onClick?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "testimony":
        return "bg-blue-500/20 text-blue-500 border-blue-500/40";
      case "legal":
        return "bg-purple-500/20 text-purple-500 border-purple-500/40";
      case "prayer":
        return "bg-green-500/20 text-green-500 border-green-500/40";
      case "righteous_insight":
        return "bg-amber-500/20 text-amber-500 border-amber-500/40";
      default:
        return "bg-justice-secondary/20 text-justice-secondary border-justice-secondary/40";
    }
  };

  // Format category name
  const formatCategoryName = (category: string) => {
    switch (category) {
      case "testimony":
        return "Testimony";
      case "legal":
        return "Legal";
      case "prayer":
        return "Prayer";
      case "righteous_insight":
        return "Righteous Insight";
      default:
        return category;
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card 
      className={cn(
        "bg-black/40 border-justice-secondary/30 hover:border-justice-secondary transition-all",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.avatar_url || undefined} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <p className="font-medium text-justice-light">{post.username}</p>
              <p className="text-sm text-justice-light/60 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {formattedDate}
              </p>
            </div>
          </div>
          
          <Badge 
            variant="outline"
            className={cn("border", getCategoryColor(post.category))}
          >
            {formatCategoryName(post.category)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <h3 className="text-lg font-semibold mb-2 text-justice-light">{post.title}</h3>
        <p className="text-justice-light/80 line-clamp-3">{post.content}</p>
      </CardContent>
      
      <CardFooter className="text-justice-light/60 border-t border-justice-tertiary/20 pt-3">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments_count}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

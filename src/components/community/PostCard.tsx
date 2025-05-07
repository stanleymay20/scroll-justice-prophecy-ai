import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { CommunityPost } from '@/types/community';

interface PostCardProps {
  post: CommunityPost;
  showActions?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, showActions = true }) => {
  const navigate = useNavigate();

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="bg-black/40 border-justice-secondary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.avatar_url} alt={`Avatar of ${post.username}`} />
            <AvatarFallback>{post.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="text-sm font-medium">{post.username}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <Badge variant="secondary">{post.category}</Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-sm text-muted-foreground">{post.content}</p>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(`/community/post/${post.id}`)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Discuss
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

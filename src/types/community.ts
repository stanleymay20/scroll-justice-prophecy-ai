
export type PostCategory =
  | "testimony"
  | "legal_question"
  | "prayer_request"
  | "righteous_insight"
  | "announcement";

export type Post = {
  id: string;
  user_id: string;
  username?: string;
  title: string;
  content: string;
  category: PostCategory;
  created_at: string;
  updated_at: string;
  likes: number;
  comments_count: number;
  tags?: string[];
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  username?: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes: number;
  parent_comment_id?: string;
};

export type ScrollWitnessBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: 1 | 2 | 3 | 4 | 5;
  requirements: {
    min_trials_attended?: number;
    min_testimonies_written?: number;
    min_prayer_requests_answered?: number;
    min_righteous_insights_shared?: number;
  };
};

export type CommunityMember = {
  user_id: string;
  username: string;
  avatar_url?: string;
  role: "witness" | "advocate" | "steward" | "judge";
  join_date: string;
  badges: string[];
  posts_count: number;
  comments_count: number;
  trials_attended: number;
  testimony_score: number;
};

export type PrivateMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
  encrypted: boolean;
};

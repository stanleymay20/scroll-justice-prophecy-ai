
export type PostCategory = 'testimony' | 'prayer_request' | 'legal_question' | 'righteous_insight' | 'announcement';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  likes?: number;
  comments_count?: number;
  author?: {
    username?: string;
    avatar_url?: string;
  };
  username?: string; // Added to support the current UI expectations
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: {
    username?: string;
    avatar_url?: string;
  };
}

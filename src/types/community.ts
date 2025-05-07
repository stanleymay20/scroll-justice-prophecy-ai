
export type PostCategory = "testimony" | "prayer_request" | "legal_question" | "righteous_insight" | "announcement";

export type PostType = "testimony" | "legal_question" | "prayer_request" | "righteous_insight" | "announcement" | "all";

export interface Post {
  id: string;
  user_id: string;
  username: string;
  title: string;
  content: string;
  category: PostCategory;
  created_at: string;
  updated_at: string;
  likes: number;
  comments_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  likes: number;
}

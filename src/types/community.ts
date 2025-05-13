
import { Database } from "@/integrations/supabase/types";

export type PostCategory = Database["public"]["Enums"]["post_category"];

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

export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

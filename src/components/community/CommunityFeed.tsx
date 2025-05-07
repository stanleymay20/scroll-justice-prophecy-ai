import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquare, AlertTriangle, Search, FileText, PlusCircle, SlidersHorizontal } from "lucide-react";
import { PostCard } from "./PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/language";
import { PostType } from "@/types/community";

// CommunityPost interface updated to match database structure
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: PostType;
  created_at: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  likes: number;
  comments_count: number;
}

interface CommunityFeedProps {
  initialCategory?: PostType;
  limit?: number;
  showCreateButton?: boolean;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  initialCategory = 'all',
  limit = 20,
  showCreateButton = true
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PostType>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        // Apply category filter if not 'all'
        if (selectedCategory !== 'all') {
          // Map UI category to database category if needed
          const dbCategory = selectedCategory === 'legal' ? 'legal_question' : 
                            selectedCategory === 'prayer' ? 'prayer_request' : 
                            selectedCategory;
          query = query.eq('category', dbCategory);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform the data to match the CommunityPost interface
        const formattedPosts: CommunityPost[] = data.map(post => {
          // Safely extract profile data with fallbacks
          const username = post.profiles?.username || 'Anonymous';
          const avatarUrl = post.profiles?.avatar_url || null;

          // Map database category to UI category if needed
          let uiCategory = post.category as PostType;
          
          return {
            ...post,
            username,
            avatar_url: avatarUrl,
            category: uiCategory
          };
        });
        
        setPosts(formattedPosts);
        setFilteredPosts(formattedPosts);
        
        // Apply search filter if there's a query
        if (searchQuery) {
          handleSearch(searchQuery, formattedPosts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load community posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, limit, toast]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    // Convert UI category to database category
    setSelectedCategory(category as PostType);
  };

  // Handle search
  const handleSearch = (query: string, postsToFilter = posts) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredPosts(postsToFilter);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = postsToFilter.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.username?.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredPosts(filtered);
  };

  // Navigate to create post page
  const handleCreatePost = () => {
    navigate('/community/create');
  };

  // Loading skeletons
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div>
          <Skeleton className="h-10 w-full mb-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (filteredPosts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Tabs 
            defaultValue={selectedCategory} 
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="testimony">Testimony</TabsTrigger>
              <TabsTrigger value="legal_question">Legal</TabsTrigger>
              <TabsTrigger value="prayer_request">Prayer</TabsTrigger>
              <TabsTrigger value="righteous_insight">Insights</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {showCreateButton && (
            <Button 
              onClick={handleCreatePost}
              className="ml-4 whitespace-nowrap"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          )}
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-justice-light/50" />
          <Input
            className="pl-10"
            placeholder="Search community posts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-justice-light/30 mb-4" />
          <h3 className="text-xl font-medium text-justice-light mb-1">No Posts Found</h3>
          <p className="text-justice-light/70">
            {searchQuery 
              ? "No posts match your search criteria." 
              : `There are no ${selectedCategory !== 'all' ? selectedCategory : ''} posts yet.`}
          </p>
          {showCreateButton && (
            <Button 
              onClick={handleCreatePost} 
              className="mt-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Be the first to post
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
        <Tabs 
          defaultValue={selectedCategory} 
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="testimony">Testimony</TabsTrigger>
            <TabsTrigger value="legal_question">Legal</TabsTrigger>
            <TabsTrigger value="prayer_request">Prayer</TabsTrigger>
            <TabsTrigger value="righteous_insight">Insights</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {showCreateButton && (
          <Button 
            onClick={handleCreatePost}
            className="whitespace-nowrap sm:ml-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        )}
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-justice-light/50" />
        <Input
          className="pl-10"
          placeholder="Search community posts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <PostCard 
            key={post.id}
            post={post}
            onClick={() => navigate(`/community/post/${post.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

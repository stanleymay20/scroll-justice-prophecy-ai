
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  Star,
  ListFilter,
  PieChart
} from "lucide-react";
import { SessionFeedback, FeedbackRating } from "@/types/courtroom";
import { supabase } from "@/lib/supabase";

interface FeedbackStats {
  total: number;
  average: number;
  byRating: {
    [key: number]: number;
  };
}

interface ProfileData {
  username?: string;
  avatar_url?: string;
}

interface CourtSessionData {
  title?: string;
}

interface FeedbackData {
  id: string;
  session_id: string;
  user_id: string;
  rating: FeedbackRating;
  testimony: string;
  created_at: string;
  is_anonymous: boolean;
  profiles?: ProfileData;
  court_sessions?: CourtSessionData;
}

export function FeedbackHub() {
  const [feedback, setFeedback] = useState<SessionFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    average: 0,
    byRating: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  });
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    fetchFeedback();
  }, [activeTab]);
  
  const fetchFeedback = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('session_feedback')
        .select(`
          id,
          session_id,
          user_id,
          rating,
          testimony,
          created_at,
          is_anonymous,
          profiles (username, avatar_url),
          court_sessions (title)
        `)
        .order('created_at', { ascending: false });
      
      if (activeTab === "positive") {
        query = query.gte('rating', 4);
      } else if (activeTab === "neutral") {
        query = query.eq('rating', 3);
      } else if (activeTab === "negative") {
        query = query.lte('rating', 2);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        const formattedFeedback = data.map((item: FeedbackData) => ({
          id: item.id,
          session_id: item.session_id,
          user_id: item.user_id,
          username: item.is_anonymous ? 'Anonymous Witness' : (item.profiles?.username || 'Unknown User'),
          session_title: item.court_sessions?.title || 'Unknown Session',
          rating: item.rating as FeedbackRating,
          testimony: item.testimony,
          created_at: item.created_at,
          is_anonymous: item.is_anonymous
        }));
        
        setFeedback(formattedFeedback);
        
        // Calculate stats
        if (data.length > 0) {
          const total = data.length;
          const ratingSum = data.reduce((sum, item) => sum + item.rating, 0);
          const average = Math.round((ratingSum / total) * 10) / 10;
          
          const byRating = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          };
          
          data.forEach(item => {
            byRating[item.rating] = (byRating[item.rating] || 0) + 1;
          });
          
          setStats({ total, average, byRating });
        }
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
      />
    ));
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Sacred Feedback Hub</h2>
        <p className="text-muted-foreground mt-2">
          Review and analyze feedback from scroll witnesses across court sessions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground ml-2 mb-1">testimonies</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end">
              <div className="text-3xl font-bold">{stats.average}</div>
              <div className="flex ml-2 mb-1">
                {renderStars(Math.round(stats.average))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex flex-col items-center">
                  <div className="text-sm">{rating}</div>
                  <div 
                    className="w-4 bg-justice-primary/30 rounded-t-sm mt-1" 
                    style={{ 
                      height: `${Math.max(15, (stats.byRating[rating] / stats.total) * 60)}px` 
                    }}
                  ></div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.total > 0 ? Math.round((stats.byRating[rating] / stats.total) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ListFilter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <PieChart className="h-4 w-4" />
              <span>Reports</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value={activeTab}>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse bg-muted rounded-full h-12 w-12 mb-4"></div>
              <p className="text-muted-foreground">Loading feedback...</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No feedback found</h3>
              <p className="text-muted-foreground mb-6">No testimonies have been submitted yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedback.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div 
                    className={`h-1 ${
                      item.rating >= 4 ? 'bg-green-500' : 
                      item.rating === 3 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                  ></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          {renderStars(item.rating)}
                          <span className="ml-2 text-sm font-medium">{item.session_title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.username} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {item.rating >= 4 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : item.rating <= 2 ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{item.testimony}</p>
                  </CardContent>
                </Card>
              ))}
              
              {feedback.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline">Load More</Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

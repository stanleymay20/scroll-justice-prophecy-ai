
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { FileUploadZone } from '@/components/ui/FileUploadZone';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mic, MicOff, Sparkles, Scale } from 'lucide-react';
import { Jurisdiction, Category, SpeechRecognitionInstance } from '@/types/petition';

interface PetitionFormProps {
  onSubmitted?: () => void;
}

export function PetitionForm({ onSubmitted }: PetitionFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Load jurisdictions and categories
  useEffect(() => {
    loadJurisdictions();
    loadCategories();
    initializeSpeechRecognition();
  }, []);

  const loadJurisdictions = async () => {
    try {
      // For now, use mock data since the table might not be reflected in types yet
      const mockJurisdictions: Jurisdiction[] = [
        { id: '1', code: 'US-NY', name: 'New York', country: 'United States', region: 'New York' },
        { id: '2', code: 'DE-BY', name: 'Bavaria', country: 'Germany', region: 'Bayern' },
        { id: '3', code: 'FR-IDF', name: 'Île-de-France', country: 'France', region: 'Paris Region' },
        { id: '4', code: 'GB-ENG', name: 'England', country: 'United Kingdom', region: 'England' },
        { id: '5', code: 'INT', name: 'International', country: 'International', region: 'Global' }
      ];
      setJurisdictions(mockJurisdictions);
    } catch (error) {
      console.error('Error loading jurisdictions:', error);
    }
  };

  const loadCategories = async () => {
    try {
      // Use mock data for categories
      const mockCategories: Category[] = [
        { id: '1', name: 'Wage Theft', description: 'Unpaid wages, overtime violations' },
        { id: '2', name: 'Discrimination', description: 'Workplace or housing discrimination' },
        { id: '3', name: 'Consumer Fraud', description: 'Deceptive business practices' },
        { id: '4', name: 'Housing Rights', description: 'Illegal evictions, unsafe conditions' },
        { id: '5', name: 'Labor Violations', description: 'Unsafe working conditions' },
        { id: '6', name: 'Environmental Justice', description: 'Pollution, environmental crimes' }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setDescription(prev => prev + transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: "Voice Input Unavailable",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const generateAISuggestion = async () => {
    if (!description.trim()) {
      toast({
        title: "Add Description First",
        description: "Please enter a description before getting AI suggestions.",
        variant: "destructive"
      });
      return;
    }

    setLoadingAI(true);
    try {
      // Mock AI suggestion for now
      const suggestions = [
        "Based on your description, this appears to be a wage theft case under labor law.",
        "This situation may constitute workplace discrimination protected under civil rights law.",
        "Your case shows elements of consumer fraud under consumer protection regulations.",
        "This appears to be a housing rights violation under tenant protection laws."
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestion(randomSuggestion);
      
      // Auto-detect category based on keywords
      const descriptionLower = description.toLowerCase();
      if (descriptionLower.includes('wage') || descriptionLower.includes('overtime') || descriptionLower.includes('pay')) {
        setSelectedCategory('1'); // Wage Theft
      } else if (descriptionLower.includes('discrimin') || descriptionLower.includes('harass')) {
        setSelectedCategory('2'); // Discrimination
      } else if (descriptionLower.includes('fraud') || descriptionLower.includes('scam')) {
        setSelectedCategory('3'); // Consumer Fraud
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
      toast({
        title: "AI Suggestion Failed",
        description: "Unable to generate suggestion at this time.",
        variant: "destructive"
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Sacred Challenge",
        description: "Please complete the title and description fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a petition.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create petition
      const { data: petition, error: petitionError } = await supabase
        .from('scroll_petitions')
        .insert({
          title: title.trim(),
          description: description.trim(),
          petitioner_id: user.id,
          status: 'pending',
          scroll_integrity_score: 100,
          is_sealed: false
        })
        .select()
        .single();

      if (petitionError) throw petitionError;

      // Log analytics
      try {
        const analyticsData = {
          event_type: 'petition_filed',
          user_id: user.id,
          petition_id: petition.id,
          jurisdiction_id: selectedJurisdiction || null,
          metadata: {
            category: selectedCategory,
            has_evidence: files.length > 0,
            ai_suggestion_used: !!aiSuggestion
          }
        };
        
        // This would normally go to scroll_analytics table
        console.log('Analytics data:', analyticsData);
      } catch (analyticsError) {
        console.error('Analytics error:', analyticsError);
      }

      toast({
        title: "Sacred Petition Submitted",
        description: "Your petition has been recorded in the sacred scrolls and will be reviewed by the ScrollProphet AI.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedJurisdiction('');
      setFiles([]);
      setAiSuggestion('');

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (error: any) {
      console.error('Error submitting petition:', error);
      toast({
        title: "Sacred Error",
        description: error.message || "Failed to submit petition. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Scale className="h-6 w-6 text-justice-primary" />
        <h2 className="text-2xl font-cinzel text-white">Submit Sacred Petition</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction</Label>
            <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
              <SelectTrigger className="bg-black/20 border-justice-primary/30">
                <SelectValue placeholder="Select jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {jurisdictions.map((jurisdiction) => (
                  <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
                    {jurisdiction.name} ({jurisdiction.country})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Case Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-black/20 border-justice-primary/30">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Petition Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the sacred purpose of your petition"
            className="bg-black/20 border-justice-primary/30 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Petition Description</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleVoiceInput}
                className={`${isListening ? 'bg-red-500/20 border-red-500' : 'border-justice-primary/30'}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? 'Stop' : 'Voice'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAISuggestion}
                disabled={loadingAI}
                className="border-justice-primary/30"
              >
                {loadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                AI Assist
              </Button>
            </div>
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your petition in detail for the sacred scrolls..."
            rows={6}
            className="bg-black/20 border-justice-primary/30 text-white"
            required
          />
          {isListening && (
            <div className="flex items-center space-x-2 text-sm text-red-400">
              <div className="animate-pulse w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Listening... Speak clearly into your microphone</span>
            </div>
          )}
        </div>

        {aiSuggestion && (
          <div className="bg-justice-primary/10 border border-justice-primary/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-justice-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">ScrollProphet AI Suggestion</h4>
                <p className="text-justice-light text-sm">{aiSuggestion}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Supporting Evidence (Optional)</Label>
          <FileUploadZone
            onFilesChange={setFiles}
            acceptedFileTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4,.zip"
            maxFiles={5}
          />
        </div>

        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={loading}
            className="bg-justice-primary hover:bg-justice-tertiary flex-1"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Sacred Petition
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}

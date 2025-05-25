
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { FileUploadZone } from '@/components/uploads/FileUploadZone';
import { Mic, MicOff, Upload, Scroll, Globe } from 'lucide-react';

interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  country: string;
  region: string;
  legal_system: string;
  languages: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  legal_basis: string;
}

interface PetitionFormData {
  title: string;
  description: string;
  category_id: string;
  jurisdiction_id: string;
  language: string;
  evidence_files: File[];
  is_public: boolean;
}

const PetitionForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PetitionFormData>({
    title: '',
    description: '',
    category_id: '',
    jurisdiction_id: '',
    language: 'en',
    evidence_files: [],
    is_public: true
  });
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    fetchJurisdictions();
    fetchCategories();
    setupSpeechRecognition();
  }, []);

  const fetchJurisdictions = async () => {
    try {
      const { data, error } = await supabase
        .from('jurisdictions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setJurisdictions(data || []);
    } catch (error) {
      console.error('Error fetching jurisdictions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('petition_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = formData.language || 'en-US';
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        setFormData(prev => ({
          ...prev,
          description: prev.description + transcript
        }));
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognition);
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleInputChange = (field: keyof PetitionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const detectCategory = async (title: string, description: string) => {
    // Simple keyword-based category detection
    const text = (title + ' ' + description).toLowerCase();
    
    const categoryKeywords = {
      'wage theft': ['wage', 'salary', 'overtime', 'payment', 'unpaid', 'payroll'],
      'discrimination': ['discriminat', 'bias', 'unfair treatment', 'harassment', 'prejudice'],
      'consumer fraud': ['fraud', 'scam', 'deceptive', 'misleading', 'false advertising'],
      'housing rights': ['eviction', 'landlord', 'rent', 'housing', 'tenant'],
      'labor violations': ['unsafe', 'workplace', 'conditions', 'fired', 'terminated'],
      'environmental justice': ['pollution', 'toxic', 'environmental', 'contamination']
    };

    for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        const category = categories.find(c => c.name.toLowerCase().includes(categoryName));
        if (category) {
          handleInputChange('category_id', category.id);
          toast({
            title: "Category Detected",
            description: `Auto-detected category: ${category.name}`,
          });
        }
        break;
      }
    }
  };

  const uploadEvidence = async (files: File[]): Promise<string[]> => {
    const uploadedFiles: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `evidence/${fileName}`;
      
      try {
        const { error } = await supabase.storage
          .from('evidence')
          .upload(filePath, file);
        
        if (error) throw error;
        uploadedFiles.push(filePath);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    return uploadedFiles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload evidence files
      const evidenceFiles = await uploadEvidence(formData.evidence_files);
      
      // Create petition
      const { data: petition, error: petitionError } = await supabase
        .from('scroll_petitions')
        .insert({
          title: formData.title,
          description: formData.description,
          petitioner_id: user.id,
          status: 'pending',
          is_sealed: false
        })
        .select()
        .single();
      
      if (petitionError) throw petitionError;
      
      // Store evidence files
      if (evidenceFiles.length > 0) {
        const evidenceRecords = evidenceFiles.map(filePath => ({
          petition_id: petition.id,
          file_path: filePath,
          file_type: 'document',
          uploaded_by: user.id,
          description: 'Evidence file'
        }));
        
        const { error: evidenceError } = await supabase
          .from('scroll_evidence')
          .insert(evidenceRecords);
        
        if (evidenceError) throw evidenceError;
      }
      
      // Log analytics
      await supabase
        .from('scroll_analytics')
        .insert({
          event_type: 'petition_filed',
          user_id: user.id,
          petition_id: petition.id,
          jurisdiction_id: formData.jurisdiction_id,
          metadata: {
            category_id: formData.category_id,
            language: formData.language,
            evidence_count: evidenceFiles.length
          }
        });
      
      toast({
        title: "Sacred Petition Filed",
        description: "Your petition has been submitted for divine judgment",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        jurisdiction_id: '',
        language: 'en',
        evidence_files: [],
        is_public: true
      });
      
    } catch (error: any) {
      console.error('Error submitting petition:', error);
      toast({
        title: "Sacred Error",
        description: error.message || "Failed to submit petition",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/40 border-justice-primary/30">
      <CardHeader>
        <CardTitle className="text-2xl font-cinzel text-white flex items-center">
          <Scroll className="h-6 w-6 mr-2 text-justice-primary" />
          File Sacred Petition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-justice-light">
              Petition Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => {
                handleInputChange('title', e.target.value);
                if (e.target.value && formData.description) {
                  detectCategory(e.target.value, formData.description);
                }
              }}
              placeholder="Brief title of your case"
              className="bg-black/20 border-justice-primary/30 text-white"
              required
            />
          </div>

          {/* Jurisdiction */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-justice-light">
              <Globe className="inline h-4 w-4 mr-1" />
              Jurisdiction
            </label>
            <Select value={formData.jurisdiction_id} onValueChange={(value) => handleInputChange('jurisdiction_id', value)}>
              <SelectTrigger className="bg-black/20 border-justice-primary/30 text-white">
                <SelectValue placeholder="Select jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {jurisdictions.map((jurisdiction) => (
                  <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
                    {jurisdiction.name}, {jurisdiction.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-justice-light">
              Case Category
            </label>
            <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
              <SelectTrigger className="bg-black/20 border-justice-primary/30 text-white">
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

          {/* Description with Voice Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-justice-light">
                Detailed Description *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleRecording}
                className={`${isRecording ? 'bg-red-500/20 border-red-500' : 'bg-black/20 border-justice-primary/30'}`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? 'Stop' : 'Voice Input'}
              </Button>
            </div>
            <Textarea
              value={formData.description}
              onChange={(e) => {
                handleInputChange('description', e.target.value);
                if (formData.title && e.target.value) {
                  detectCategory(formData.title, e.target.value);
                }
              }}
              placeholder="Describe your case in detail..."
              rows={6}
              className="bg-black/20 border-justice-primary/30 text-white"
              required
            />
          </div>

          {/* Evidence Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-justice-light">
              <Upload className="inline h-4 w-4 mr-1" />
              Evidence Files
            </label>
            <FileUploadZone
              onFilesSelected={(files) => handleInputChange('evidence_files', files)}
              acceptedFileTypes=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp3,.wav,.zip"
              maxFiles={10}
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-justice-light">
              Language
            </label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger className="bg-black/20 border-justice-primary/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-justice-primary hover:bg-justice-tertiary text-white font-semibold"
          >
            {isSubmitting ? "Filing Sacred Petition..." : "File Sacred Petition"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PetitionForm;

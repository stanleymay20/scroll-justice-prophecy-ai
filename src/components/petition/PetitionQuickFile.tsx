
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/language';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Send, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { InjusticeCategory } from '@/types';

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface PetitionQuickFileProps {
  onSuccess?: () => void;
}

export const PetitionQuickFile: React.FC<PetitionQuickFileProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as InjusticeCategory | ''
  });
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const injusticeCategories: InjusticeCategory[] = [
    'employment', 'housing', 'healthcare', 'education', 'financial',
    'discrimination', 'government', 'consumer', 'family', 'criminal'
  ];

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice input',
        variant: 'destructive'
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        description: prev.description + ' ' + transcript
      }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: 'Voice input error',
        description: 'Failed to capture voice input',
        variant: 'destructive'
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.description || !formData.category) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('scroll_petitions')
        .insert({
          title: formData.title,
          description: formData.description,
          petitioner_id: user.id,
          status: 'pending',
          scroll_integrity_score: 100,
          is_sealed: false
        });

      if (error) throw error;

      toast({
        title: 'Petition filed successfully',
        description: 'Your petition has been submitted for review'
      });

      setFormData({ title: '', description: '', category: '' });
      onSuccess?.();
    } catch (error) {
      console.error('Error filing petition:', error);
      toast({
        title: 'Error filing petition',
        description: 'Failed to submit petition. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-justice-light mb-2">
          {t('petition.title')}
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief title of your petition"
          required
          className="w-full px-3 py-2 bg-black/30 border border-justice-primary/30 rounded text-white placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-justice-light mb-2">
          {t('petition.category')}
        </label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as InjusticeCategory }))}>
          <SelectTrigger className="bg-black/30 border-justice-primary/30 text-white">
            <SelectValue placeholder="Select injustice category" />
          </SelectTrigger>
          <SelectContent>
            {injusticeCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {t(`petition.categories.${category}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-justice-light">
            {t('petition.description')}
          </label>
          <Button
            type="button"
            onClick={handleVoiceInput}
            disabled={isRecording}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Mic className={`mr-1 h-3 w-3 ${isRecording ? 'text-red-500' : ''}`} />
            {isRecording ? 'Recording...' : 'Voice'}
          </Button>
        </div>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the injustice you have experienced in detail..."
          required
          rows={4}
          className="bg-black/30 border-justice-primary/30 text-white"
        />
      </div>

      <div className="p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
        <p className="text-amber-200 text-sm">
          <strong>Legal Disclaimer:</strong> This petition will be processed by AI for advisory analysis only. 
          AI-generated verdicts do not constitute professional legal advice and should not be relied upon for 
          actual legal decisions. Consult qualified legal professionals for binding legal counsel.
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading || !formData.title || !formData.description || !formData.category}
        className="w-full bg-justice-primary hover:bg-justice-tertiary"
      >
        {loading ? (
          <>
            <FileText className="mr-2 h-4 w-4 animate-spin" />
            Filing Petition...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            File Sacred Petition
          </>
        )}
      </Button>
    </form>
  );
};

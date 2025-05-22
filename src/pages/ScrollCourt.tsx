
import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { Mic, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ScrollCourt = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  // Remove file from list
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = async () => {
    try {
      setIsRecording(true);
      // Voice recording functionality would be implemented here
      toast({
        title: "Recording started",
        description: "Speak clearly to record your petition",
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "Failed to start recording",
        description: "Please check microphone permissions",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };
  
  const stopRecording = async () => {
    setIsRecording(false);
    // Voice recording stop functionality would be implemented here
    toast({
      title: "Recording stopped",
      description: "Your spoken petition has been captured",
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload evidence files first if any
      const evidenceUrls: string[] = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `evidence/${user?.id}/${fileName}`;
          
          try {
            const { error: uploadError } = await supabase.storage
              .from('petitions')
              .upload(filePath, file);
              
            if (uploadError) {
              throw uploadError;
            }
            
            evidenceUrls.push(filePath);
          } catch (error) {
            console.error("Error uploading file:", error);
            toast({
              title: "Error uploading file",
              description: "One or more files failed to upload",
              variant: "destructive",
            });
          }
        }
      }
      
      // Create petition in database
      const { error } = await supabase
        .from('scroll_petitions')
        .insert({
          title,
          description,
          petitioner_id: user?.id,
          status: 'pending',
          // Save evidence URLs in a separate table or field if supported
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Scroll submitted",
        description: "Your petition has been recorded in the sacred scrolls",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setFiles([]);
      
    } catch (error) {
      console.error("Error submitting petition:", error);
      toast({
        title: "Error submitting petition",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("scrollCourt.title", "Scroll Court")} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-cinzel text-white text-center mb-8">
          {t("scrollCourt.title", "Sacred Scroll Petition Court")}
        </h1>
        
        <GlassCard className="max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-justice-light">
                Petition Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your petition"
                required
                className="bg-black/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-justice-light">
                Petition Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wage Theft">Wage Theft</SelectItem>
                  <SelectItem value="Land Injustice">Land Injustice</SelectItem>
                  <SelectItem value="Violence">Violence</SelectItem>
                  <SelectItem value="False Judgment">False Judgment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-justice-light">
                Petition Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your petition in detail"
                required
                className="min-h-32 bg-black/30"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-justice-light">
                Evidence Files
              </label>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="bg-black/30 border-justice-primary/50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button 
                  type="button" 
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={toggleRecording}
                  className={isRecording ? "bg-red-900/70" : "bg-black/30 border-justice-primary/50"}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {isRecording ? "Stop Recording" : "Voice Petition"}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-justice-light">Attached Files:</p>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-black/40 rounded px-3 py-2">
                        <span className="text-sm text-justice-light truncate">{file.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4 text-justice-light/70" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-justice-primary hover:bg-justice-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <PulseEffect color="bg-white" size="sm" />
                  <span className="ml-2">Submitting Petition...</span>
                </>
              ) : (
                "Submit Sacred Petition"
              )}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ScrollCourt;

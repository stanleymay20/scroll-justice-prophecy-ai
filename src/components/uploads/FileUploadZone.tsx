
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Upload,
  Image,
  Mic,
  MicOff,
  ScreenShare,
  ScreenShareOff,
  File,
  Files
} from "lucide-react";

interface FileUploadZoneProps {
  onFilesUploaded?: (files: File[]) => void;
  allowedTypes?: string[];
  maxFileSize?: number; // in MB
  multiple?: boolean;
  className?: string;
}

export function FileUploadZone({ 
  onFilesUploaded, 
  allowedTypes = [".pdf", ".docx", ".txt", ".jpg", ".png"], 
  maxFileSize = 10,
  multiple = true,
  className = ""
}: FileUploadZoneProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);
  
  const handleFiles = useCallback((files: File[]) => {
    // Check file types
    const invalidFiles = files.filter(file => {
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return !allowedTypes.includes(fileExt);
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: `These file types are not allowed: ${invalidFiles.map(f => f.name).join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Files must be under ${maxFileSize}MB: ${oversizedFiles.map(f => f.name).join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Simulate upload process
    let progress = 0;
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(null);
          if (onFilesUploaded) onFilesUploaded(files);
          toast({
            title: "Upload complete",
            description: `Successfully uploaded ${files.length} file${files.length !== 1 ? 's' : ''}`
          });
        }, 500);
      }
    }, 100);
  }, [allowedTypes, maxFileSize, onFilesUploaded, toast]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your audio recording has been saved."
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Recording your audio input..."
      });
      
      // In a real app, we would start recording here using the Web Audio API
      // For this demo, we'll just simulate it
    }
  };

  const toggleScreenSharing = () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      toast({
        title: "Screen sharing stopped",
        description: "Your screen recording has been saved."
      });
    } else {
      // In a real app, we would use navigator.mediaDevices.getDisplayMedia()
      // For this demo, we'll just simulate it
      setIsScreenSharing(true);
      toast({
        title: "Screen sharing started",
        description: "Recording your screen..."
      });
    }
  };

  return (
    <div className={`${className}`}>
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? "border-justice-primary bg-justice-primary/5" : "border-justice-tertiary/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload
          className="h-10 w-10 text-justice-primary/70 mb-3"
        />
        <h3 className="text-lg font-semibold mb-1">Drag files here</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          or click to browse your device
        </p>
        
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple={multiple}
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
        />
        
        <Button
          variant="outline"
          className="bg-justice-dark hover:bg-justice-primary/20"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Files className="mr-2 h-4 w-4" />
          Select Files
        </Button>
        
        {uploadProgress !== null && (
          <div className="w-full mt-4">
            <Progress value={uploadProgress} className="h-2 mb-1" />
            <span className="text-xs text-muted-foreground">
              {uploadProgress}% Uploaded
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <Button 
          variant="outline" 
          className="bg-justice-dark hover:bg-justice-primary/20"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Image className="mr-2 h-4 w-4" />
          Add Image
        </Button>
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={handleFileChange}
        />
        
        <Button 
          variant="outline"
          className={`${isRecording ? "bg-red-600/20 text-red-400" : "bg-justice-dark"} hover:bg-justice-primary/20`}
          onClick={toggleRecording}
        >
          {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
          {isRecording ? "Stop Recording" : "Voice Input"}
        </Button>
        
        <Button 
          variant="outline"
          className={`${isScreenSharing ? "bg-red-600/20 text-red-400" : "bg-justice-dark"} hover:bg-justice-primary/20`}
          onClick={toggleScreenSharing}
        >
          {isScreenSharing ? <ScreenShareOff className="mr-2 h-4 w-4" /> : <ScreenShare className="mr-2 h-4 w-4" />}
          {isScreenSharing ? "Stop Sharing" : "Share Screen"}
        </Button>
      </div>
    </div>
  );
}

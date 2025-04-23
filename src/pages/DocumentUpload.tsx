
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FileUploadZone } from "@/components/uploads/FileUploadZone";
import { scrollMemories, systemHealth } from "@/services/mockData";
import { Check, File, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "processing" | "complete" | "error";
  date: string;
}

const DocumentUpload = () => {
  const { toast } = useToast();
  const [uploadMode, setUploadMode] = useState<"single" | "batch">("single");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  const handleFilesUploaded = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      status: "processing",
      date: new Date().toLocaleDateString()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate processing files
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          newFiles.find(nf => nf.id === f.id) 
            ? { ...f, status: "complete" } 
            : f
        )
      );
      
      toast({
        title: "Files processed successfully",
        description: `${files.length} file${files.length !== 1 ? 's' : ''} have been processed and analyzed.`
      });
    }, 3000);
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const filteredFiles = uploadedFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    toast({
      title: "File removed",
      description: "The file has been removed from your library."
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Document Upload & Management" 
          text="Upload and manage case documents with intelligent processing"
          systemHealth={systemHealth}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="premium-card h-full">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="single" onValueChange={(value) => setUploadMode(value as "single" | "batch")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="single">Single File</TabsTrigger>
                    <TabsTrigger value="batch">Batch Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="single">
                    <FileUploadZone 
                      onFilesUploaded={handleFilesUploaded}
                      multiple={false}
                      allowedTypes={[".pdf", ".docx", ".txt", ".jpg", ".png", ".rtf"]}
                    />
                    
                    <div className="mt-6 p-4 bg-justice-primary/10 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Check className="w-4 h-4 mr-2 text-justice-primary" />
                        Scroll-Optimal Processing
                      </h4>
                      <p className="text-sm">
                        During the current {currentPhase} phase at Gate {currentGate}, document processing benefits from enhanced pattern recognition capabilities. Documents uploaded now will receive 22% higher accuracy in legal analysis.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="batch">
                    <FileUploadZone 
                      onFilesUploaded={handleFilesUploaded}
                      multiple={true}
                      maxFileSize={25}
                      allowedTypes={[".pdf", ".docx", ".txt", ".zip", ".rar"]}
                    />
                    
                    <div className="mt-6 space-y-3">
                      <div className="p-4 bg-justice-primary/10 rounded-lg">
                        <h4 className="font-medium mb-2">Batch Processing Features</h4>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <Check className="w-4 h-4 mr-2 text-justice-primary mt-0.5" />
                            <span>Automatic document classification by type and content</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="w-4 h-4 mr-2 text-justice-primary mt-0.5" />
                            <span>Extraction of key entities, dates, and legal references</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="w-4 h-4 mr-2 text-justice-primary mt-0.5" />
                            <span>Cross-document relationship mapping</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="bg-justice-dark/30 p-4 border-t border-justice-dark/50">
                <div className="text-sm text-muted-foreground">
                  Supported formats: PDF, DOCX, TXT, JPG, PNG, ZIP (for batch upload of multiple documents)
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="premium-card">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle className="flex justify-between items-center">
                  <span>Recent Uploads</span>
                  <span className="text-sm font-normal bg-justice-primary/20 px-2 py-1 rounded">{uploadedFiles.length} files</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4">
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-justice-dark/50 border-justice-tertiary/30"
                  />
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {filteredFiles.length > 0 ? (
                    <ul className="divide-y divide-justice-dark/50">
                      {filteredFiles.map((file) => (
                        <li key={file.id} className="p-3 hover:bg-justice-primary/5">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <FileText className="h-8 w-8 text-justice-light opacity-80" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>{file.size}</span>
                                <span className="mx-1">•</span>
                                <span>{file.date}</span>
                              </div>
                            </div>
                            <div className="ml-2">
                              {file.status === "processing" ? (
                                <Loader2 className="h-4 w-4 animate-spin text-justice-primary" />
                              ) : (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteFile(file.id)}
                              className="ml-2 text-muted-foreground hover:text-white"
                            >
                              ×
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-8 text-center">
                      <File className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No files uploaded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card mt-4">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Processing Features</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-center p-2 rounded hover:bg-justice-primary/5">
                    <div className="h-8 w-8 rounded-full bg-justice-primary/20 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-justice-primary" />
                    </div>
                    <div>
                      <p className="font-medium">OCR Processing</p>
                      <p className="text-xs text-muted-foreground">Extract text from images and scanned PDFs</p>
                    </div>
                  </li>
                  <li className="flex items-center p-2 rounded hover:bg-justice-primary/5">
                    <div className="h-8 w-8 rounded-full bg-justice-primary/20 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-justice-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Multi-Language Support</p>
                      <p className="text-xs text-muted-foreground">Process documents in 29 different languages</p>
                    </div>
                  </li>
                  <li className="flex items-center p-2 rounded hover:bg-justice-primary/5">
                    <div className="h-8 w-8 rounded-full bg-justice-primary/20 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-justice-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Metadata Extraction</p>
                      <p className="text-xs text-muted-foreground">Automatically extract and organize document metadata</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;

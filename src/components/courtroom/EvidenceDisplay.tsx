
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { ScrollEvidence } from '@/types/petition';
import { getEvidenceForPetition, getEvidencePublicUrl } from '@/services/evidenceService';
import { Loader2, File, Image, FileVideo, FileAudio, FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface EvidenceDisplayProps {
  petitionId: string;
  isSealed?: boolean;
  canView?: boolean;
  readOnly?: boolean;
}

export function EvidenceDisplay({ 
  petitionId, 
  isSealed = false, 
  canView = true,
  readOnly = false 
}: EvidenceDisplayProps) {
  const [evidence, setEvidence] = useState<ScrollEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<ScrollEvidence | null>(null);
  const [publicUrls, setPublicUrls] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const loadEvidence = async () => {
      try {
        setLoading(true);
        const evidenceData = await getEvidenceForPetition(petitionId);
        setEvidence(evidenceData);
        
        // Pre-fetch all public URLs
        const urlMap: Record<string, string> = {};
        for (const item of evidenceData) {
          const url = await getEvidencePublicUrl(item.file_path);
          urlMap[item.file_path] = url;
        }
        setPublicUrls(urlMap);
      } catch (err: any) {
        console.error('Error loading evidence:', err);
        setError(err.message || 'Failed to load evidence');
      } finally {
        setLoading(false);
      }
    };
    
    loadEvidence();
  }, [petitionId]);
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-6 w-6" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="h-6 w-6" />;
    if (fileType === 'application/pdf') return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };
  
  const handlePreview = (evidenceItem: ScrollEvidence) => {
    setSelectedEvidence(evidenceItem);
  };
  
  const handleDownload = async (evidenceItem: ScrollEvidence) => {
    let url = publicUrls[evidenceItem.file_path];
    if (!url) {
      url = await getEvidencePublicUrl(evidenceItem.file_path);
      setPublicUrls(prev => ({ ...prev, [evidenceItem.file_path]: url }));
    }
    
    const a = document.createElement('a');
    a.href = url;
    a.download = evidenceItem.file_path.split('/').pop() || 'evidence';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const closePreview = () => {
    setSelectedEvidence(null);
  };
  
  const getPublicUrl = (filePath: string) => {
    return publicUrls[filePath] || '';
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-destructive/20 border border-destructive/50 rounded-lg">
        <p className="text-white">Error loading evidence: {error}</p>
      </div>
    );
  }
  
  if (evidence.length === 0) {
    return (
      <div className="p-4 bg-black/20 rounded-lg text-justice-light/70 text-center">
        No evidence has been submitted for this petition
      </div>
    );
  }
  
  return (
    <>
      <div className={isSealed && !canView ? 'blur-sm pointer-events-none' : ''}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidence.map((evidenceItem) => (
            <GlassCard key={evidenceItem.id} className="p-3 hover:bg-justice-dark/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-justice-primary/20 p-2 rounded-full">
                  {getFileIcon(evidenceItem.file_type)}
                </div>
                <div className="flex-grow">
                  <p className="text-white text-sm font-medium truncate">
                    {evidenceItem.file_path.split('/').pop()}
                  </p>
                  <p className="text-justice-light/70 text-xs">
                    {format(new Date(evidenceItem.uploaded_at), 'PPp')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePreview(evidenceItem)}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownload(evidenceItem)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {evidenceItem.description && (
                <p className="mt-2 text-sm text-justice-light/80 border-t border-justice-light/10 pt-2">
                  {evidenceItem.description}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
      
      {/* Evidence Preview Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-justice-dark border border-justice-light/20 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-4 flex justify-between items-center border-b border-justice-light/10">
              <h3 className="text-white font-medium">Evidence Preview</h3>
              <Button variant="ghost" size="sm" onClick={closePreview} className="text-justice-light">
                Close
              </Button>
            </div>
            <div className="p-4">
              {selectedEvidence.file_type.startsWith('image/') ? (
                <img 
                  src={getPublicUrl(selectedEvidence.file_path)} 
                  alt="Evidence" 
                  className="max-w-full mx-auto"
                />
              ) : selectedEvidence.file_type.startsWith('video/') ? (
                <video 
                  src={getPublicUrl(selectedEvidence.file_path)} 
                  controls
                  className="max-w-full mx-auto"
                />
              ) : selectedEvidence.file_type.startsWith('audio/') ? (
                <audio 
                  src={getPublicUrl(selectedEvidence.file_path)} 
                  controls
                  className="w-full"
                />
              ) : selectedEvidence.file_type === 'application/pdf' ? (
                <iframe 
                  src={`${getPublicUrl(selectedEvidence.file_path)}#view=fitH`}
                  className="w-full h-[70vh]"
                  title="PDF Preview"
                />
              ) : (
                <div className="p-6 text-center">
                  <File className="h-12 w-12 mx-auto mb-4 text-justice-light" />
                  <p className="text-justice-light">This file type cannot be previewed.</p>
                  <Button 
                    onClick={() => handleDownload(selectedEvidence)}
                    className="mt-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
            {selectedEvidence.description && (
              <div className="border-t border-justice-light/10 p-4">
                <h4 className="text-sm font-medium text-justice-light mb-1">Description</h4>
                <p className="text-justice-light/80 text-sm">{selectedEvidence.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

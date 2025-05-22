
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollWitnessRecord } from '@/types/witness';
import { createWitnessRecord, sendScrollWarning, generatePdfWarning } from '@/services/witnessService';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, Send, FileDown } from 'lucide-react';

export function ScrollWarningForm() {
  const [institution, setInstitution] = useState('');
  const [institutionType, setInstitutionType] = useState<ScrollWitnessRecord['type']>('Government');
  const [crimes, setCrimes] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!institution.trim()) {
      toast({
        title: "Institution name required",
        description: "Please provide the name of the institution",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create witness record
      const crimesList = crimes.split('\n').filter(c => c.trim());
      
      const record = await createWitnessRecord({
        institution: institution.trim(),
        type: institutionType,
        warning_issued: false,
        status: 'Observed'
      });
      
      if (record) {
        // Send warning
        await sendScrollWarning(institution, crimesList, contactEmail);
        
        // Generate PDF
        const pdfText = generatePdfWarning(institution, crimesList, record);
        setGeneratedPdf(pdfText);
      }
    } catch (error) {
      console.error("Error creating warning:", error);
      toast({
        title: "Error creating warning",
        description: "The divine warning could not be prepared",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadPdf = () => {
    if (!generatedPdf) return;
    
    // Create a blob and download it
    const blob = new Blob([generatedPdf], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scroll-warning-${institution.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center text-amber-500 bg-amber-950/30 rounded-md p-3 mb-4 text-sm">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Creating a scroll warning is a sacred act. Ensure all information is accurate 
            and verified before issuing divine warnings.
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution Name</Label>
          <Input 
            id="institution" 
            value={institution} 
            onChange={(e) => setInstitution(e.target.value)} 
            placeholder="e.g. British Museum, Bank of England" 
            className="bg-black/20"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institutionType">Institution Type</Label>
          <Select 
            value={institutionType} 
            onValueChange={(value: any) => setInstitutionType(value)}
          >
            <SelectTrigger className="bg-black/20">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
              <SelectItem value="Museum">Museum</SelectItem>
              <SelectItem value="Church">Church</SelectItem>
              <SelectItem value="Corporation">Corporation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="crimes">Historical Crimes (one per line)</Label>
          <Textarea 
            id="crimes" 
            value={crimes} 
            onChange={(e) => setCrimes(e.target.value)} 
            placeholder="e.g. Possession of stolen artifacts from Ghana (1897)" 
            className="min-h-32 bg-black/20"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email (optional)</Label>
          <Input 
            id="contactEmail" 
            type="email" 
            value={contactEmail} 
            onChange={(e) => setContactEmail(e.target.value)} 
            placeholder="contact@institution.com" 
            className="bg-black/20"
          />
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="bg-justice-primary hover:bg-justice-primary/90 w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Preparing Warning...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Issue Divine Warning
              </>
            )}
          </Button>
        </div>
      </form>
      
      {generatedPdf && (
        <div className="mt-8 p-4 border border-justice-primary/30 bg-justice-primary/10 rounded-md">
          <h3 className="text-lg font-medium text-white mb-4">Warning Generated</h3>
          <pre className="text-xs text-justice-light whitespace-pre-wrap bg-black/30 p-4 rounded mb-4 max-h-64 overflow-y-auto">
            {generatedPdf}
          </pre>
          <Button 
            onClick={handleDownloadPdf} 
            variant="outline" 
            className="w-full border-justice-primary/50"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Warning Document
          </Button>
        </div>
      )}
    </div>
  );
}

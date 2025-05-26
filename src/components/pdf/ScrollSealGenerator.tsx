
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Mail } from 'lucide-react';
import { ScrollJudgment } from '@/types/petition';
import { toast } from '@/hooks/use-toast';

interface ScrollSealGeneratorProps {
  judgment: ScrollJudgment;
  petitionTitle: string;
  petitionerName: string;
}

export function ScrollSealGenerator({ judgment, petitionTitle, petitionerName }: ScrollSealGeneratorProps) {
  const generateScrollSealPDF = async () => {
    try {
      // In a real implementation, this would call a PDF generation service
      const pdfContent = generatePDFContent();
      
      // Create a blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ScrollSeal-${judgment.id.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "ScrollSeal Generated",
        description: "Your sacred verdict PDF has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating ScrollSeal:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate ScrollSeal PDF at this time.",
        variant: "destructive"
      });
    }
  };

  const emailScrollSeal = async () => {
    try {
      // Mock email sending
      toast({
        title: "ScrollSeal Sent",
        description: "The sacred verdict has been sent to your email.",
      });
    } catch (error) {
      console.error('Error emailing ScrollSeal:', error);
      toast({
        title: "Email Failed",
        description: "Unable to send ScrollSeal email at this time.",
        variant: "destructive"
      });
    }
  };

  const generatePDFContent = () => {
    // This is a mock PDF content - in real implementation, use jsPDF or similar
    return `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj

4 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
50 750 Td
(SCROLLJUSTICE SACRED VERDICT) Tj
0 -30 Td
/F1 12 Tf
(Petition: ${petitionTitle}) Tj
0 -20 Td
(Petitioner: ${petitionerName}) Tj
0 -20 Td
(Verdict: ${judgment.verdict}) Tj
0 -20 Td
(Date: ${new Date(judgment.created_at).toLocaleDateString()}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000205 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
455
%%EOF
    `;
  };

  return (
    <div className="flex space-x-3">
      <Button
        onClick={generateScrollSealPDF}
        className="bg-justice-primary hover:bg-justice-tertiary"
      >
        <Download className="h-4 w-4 mr-2" />
        Download ScrollSeal
      </Button>
      <Button
        onClick={emailScrollSeal}
        variant="outline"
        className="border-justice-primary/30"
      >
        <Mail className="h-4 w-4 mr-2" />
        Email ScrollSeal
      </Button>
    </div>
  );
}


import React from 'react';
import { AlertTriangle, Scale, Book } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LegalDisclaimer: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert className="border-amber-500/50 bg-amber-900/20">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-200">
          <strong>IMPORTANT LEGAL NOTICE:</strong> This platform uses artificial intelligence trained on real legal frameworks and statutes. However, AI-generated analysis does not constitute professional legal advice and should not be relied upon for actual legal decisions.
        </AlertDescription>
      </Alert>

      <Alert className="border-blue-500/50 bg-blue-900/20">
        <Scale className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <strong>SCROLL JUSTICE AUTHORITY:</strong> This system applies real legal frameworks from your selected jurisdiction combined with sacred wisdom principles. All verdicts are advisory and for educational purposes only.
        </AlertDescription>
      </Alert>

      <Alert className="border-purple-500/50 bg-purple-900/20">
        <Book className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-purple-200">
          <strong>SEEK PROFESSIONAL COUNSEL:</strong> For binding legal guidance, consult with qualified, licensed attorneys in your jurisdiction. This platform supplements but does not replace professional legal representation.
        </AlertDescription>
      </Alert>
    </div>
  );
};

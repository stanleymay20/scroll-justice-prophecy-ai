
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface JurisdictionSelectorProps {
  selectedJurisdiction: string;
  onJurisdictionChange: (jurisdiction: string) => void;
  className?: string;
}

// Real jurisdictions with actual legal systems
const REAL_JURISDICTIONS = [
  { code: 'US', name: 'United States', legal_system: 'Common Law', languages: ['en'] },
  { code: 'DE', name: 'Germany', legal_system: 'Civil Law', languages: ['de', 'en'] },
  { code: 'FR', name: 'France', legal_system: 'Civil Law', languages: ['fr', 'en'] },
  { code: 'UK', name: 'United Kingdom', legal_system: 'Common Law', languages: ['en'] },
  { code: 'GH', name: 'Ghana', legal_system: 'Common Law (British)', languages: ['en'] },
  { code: 'NG', name: 'Nigeria', legal_system: 'Common Law (British)', languages: ['en'] },
  { code: 'KE', name: 'Kenya', legal_system: 'Common Law (British)', languages: ['en', 'sw'] },
  { code: 'IN', name: 'India', legal_system: 'Common Law (British)', languages: ['en', 'hi'] },
  { code: 'BR', name: 'Brazil', legal_system: 'Civil Law', languages: ['pt', 'en'] },
  { code: 'CA', name: 'Canada', legal_system: 'Common Law', languages: ['en', 'fr'] }
];

export const JurisdictionSelector: React.FC<JurisdictionSelectorProps> = ({
  selectedJurisdiction,
  onJurisdictionChange,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-justice-light mb-2">
        <Globe className="inline mr-2 h-4 w-4" />
        Legal Jurisdiction *
      </label>
      <Select value={selectedJurisdiction} onValueChange={onJurisdictionChange}>
        <SelectTrigger className="bg-black/30 border-justice-primary/30 text-white">
          <SelectValue placeholder="Select your country/jurisdiction" />
        </SelectTrigger>
        <SelectContent>
          {REAL_JURISDICTIONS.map((jurisdiction) => (
            <SelectItem key={jurisdiction.code} value={jurisdiction.code}>
              <div className="flex flex-col">
                <span>{jurisdiction.name}</span>
                <span className="text-xs text-gray-400">
                  {jurisdiction.legal_system} • {jurisdiction.languages.join(', ')}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-justice-light/60">
        ScrollJustice will apply the actual legal framework of your selected jurisdiction
      </p>
    </div>
  );
};

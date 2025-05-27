
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Jurisdiction } from '@/types';
import { Globe, CheckCircle, AlertCircle } from 'lucide-react';

interface JurisdictionListProps {
  jurisdictions?: Jurisdiction[];
  onJurisdictionSelect?: (jurisdiction: Jurisdiction) => void;
}

const defaultJurisdictions: Jurisdiction[] = [
  { 
    id: '1', 
    code: 'US', 
    name: 'United States', 
    country: 'United States', 
    region: 'North America', 
    legal_system: 'Common Law', 
    supported: true,
    precedent_weight: 85,
    international_relevance: 92,
    un_recognized: true,
    icc_jurisdiction: false,
    active: true,
    cases_count: 1250,
    principles_count: 45,
    language_codes: ['en']
  },
  { 
    id: '2', 
    code: 'DE', 
    name: 'Germany', 
    country: 'Germany', 
    region: 'Europe', 
    legal_system: 'Civil Law', 
    supported: true,
    precedent_weight: 78,
    international_relevance: 88,
    un_recognized: true,
    icc_jurisdiction: true,
    active: true,
    cases_count: 892,
    principles_count: 38,
    language_codes: ['de']
  },
  { 
    id: '3', 
    code: 'FR', 
    name: 'France', 
    country: 'France', 
    region: 'Europe', 
    legal_system: 'Civil Law', 
    supported: true,
    precedent_weight: 82,
    international_relevance: 90,
    un_recognized: true,
    icc_jurisdiction: true,
    active: true,
    cases_count: 734,
    principles_count: 42,
    language_codes: ['fr']
  }
];

export const JurisdictionList: React.FC<JurisdictionListProps> = ({ 
  jurisdictions = defaultJurisdictions,
  onJurisdictionSelect
}) => {
  const regions = [...new Set(jurisdictions.map(j => j.region))];

  return (
    <div className="space-y-6">
      {regions.map(region => (
        <Card key={region}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {region}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jurisdictions
                .filter(j => j.region === region)
                .map(jurisdiction => (
                  <div key={jurisdiction.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{jurisdiction.name}</h4>
                      <div className="flex items-center gap-2">
                        {jurisdiction.supported ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        {onJurisdictionSelect && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onJurisdictionSelect(jurisdiction)}
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Badge variant="outline">{jurisdiction.legal_system}</Badge>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Precedent Weight:</span>
                          <span>{jurisdiction.precedent_weight || 75}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Int'l Relevance:</span>
                          <span>{jurisdiction.international_relevance || 80}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cases:</span>
                          <span>{jurisdiction.cases_count || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Principles:</span>
                          <span>{jurisdiction.principles_count || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        {jurisdiction.un_recognized && (
                          <Badge variant="secondary" className="text-xs">UN</Badge>
                        )}
                        {jurisdiction.icc_jurisdiction && (
                          <Badge variant="secondary" className="text-xs">ICC</Badge>
                        )}
                        {jurisdiction.active && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                        {jurisdiction.language_codes && jurisdiction.language_codes.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {jurisdiction.language_codes.join(', ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

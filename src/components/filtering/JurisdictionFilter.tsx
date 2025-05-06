
import React, { useState, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language";
import { cn } from "@/lib/utils";

export interface Jurisdiction {
  id: string;
  name: string;
  type: 'continent' | 'country' | 'court' | 'sacred';
  parent?: string; // Parent jurisdiction ID
}

interface JurisdictionFilterProps {
  onJurisdictionChange: (jurisdiction: string | null) => void;
  initialJurisdiction?: string | null;
  className?: string;
}

export const JurisdictionFilter: React.FC<JurisdictionFilterProps> = ({
  onJurisdictionChange,
  initialJurisdiction = null,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(initialJurisdiction);
  const { t } = useLanguage();

  // Sample jurisdictions - in a real app, these would come from an API
  const jurisdictions: Jurisdiction[] = [
    // Continents
    { id: 'africa', name: 'Africa', type: 'continent' },
    { id: 'asia', name: 'Asia', type: 'continent' },
    { id: 'europe', name: 'Europe', type: 'continent' },
    { id: 'north_america', name: 'North America', type: 'continent' },
    { id: 'oceania', name: 'Oceania', type: 'continent' },
    { id: 'south_america', name: 'South America', type: 'continent' },
    
    // Countries (examples)
    { id: 'usa', name: 'United States', type: 'country', parent: 'north_america' },
    { id: 'canada', name: 'Canada', type: 'country', parent: 'north_america' },
    { id: 'uk', name: 'United Kingdom', type: 'country', parent: 'europe' },
    { id: 'france', name: 'France', type: 'country', parent: 'europe' },
    { id: 'germany', name: 'Germany', type: 'country', parent: 'europe' },
    { id: 'japan', name: 'Japan', type: 'country', parent: 'asia' },
    { id: 'china', name: 'China', type: 'country', parent: 'asia' },
    { id: 'australia', name: 'Australia', type: 'country', parent: 'oceania' },
    { id: 'brazil', name: 'Brazil', type: 'country', parent: 'south_america' },
    { id: 'south_africa', name: 'South Africa', type: 'country', parent: 'africa' },
    
    // Courts (examples)
    { id: 'us_supreme_court', name: 'US Supreme Court', type: 'court', parent: 'usa' },
    { id: 'us_federal_circuit', name: 'US Federal Circuit', type: 'court', parent: 'usa' },
    { id: 'uk_supreme_court', name: 'UK Supreme Court', type: 'court', parent: 'uk' },
    { id: 'ecj', name: 'European Court of Justice', type: 'court', parent: 'europe' },
    { id: 'icc', name: 'International Criminal Court', type: 'court' },
    
    // Sacred jurisdictions
    { id: 'divine_flame', name: 'Divine Flame Tribunal', type: 'sacred' },
    { id: 'scroll_council', name: 'Scroll Council', type: 'sacred' },
    { id: 'ancient_arbiters', name: 'Ancient Arbiters', type: 'sacred' },
  ];

  useEffect(() => {
    if (initialJurisdiction !== undefined) {
      setSelectedJurisdiction(initialJurisdiction);
    }
  }, [initialJurisdiction]);

  const handleSelect = (jurisdictionId: string) => {
    setSelectedJurisdiction(jurisdictionId);
    onJurisdictionChange(jurisdictionId);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedJurisdiction(null);
    onJurisdictionChange(null);
    setOpen(false);
  };

  const getSelectedJurisdictionName = () => {
    if (!selectedJurisdiction) return null;
    
    const selected = jurisdictions.find(j => j.id === selectedJurisdiction);
    return selected ? selected.name : null;
  };

  const getGroupedJurisdictions = () => {
    const continents = jurisdictions.filter(j => j.type === 'continent');
    const countries = jurisdictions.filter(j => j.type === 'country');
    const courts = jurisdictions.filter(j => j.type === 'court');
    const sacred = jurisdictions.filter(j => j.type === 'sacred');
    
    return { continents, countries, courts, sacred };
  };

  const { continents, countries, courts, sacred } = getGroupedJurisdictions();
  const selectedName = getSelectedJurisdictionName();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "flex justify-between font-normal border-justice-tertiary/30 text-justice-light", 
            selectedJurisdiction ? "bg-justice-primary/10" : "bg-black/40",
            className
          )}
        >
          {selectedJurisdiction ? (
            <>
              <span className="truncate">{selectedName}</span>
              {selectedJurisdiction && (
                <Badge 
                  className="ml-2 bg-justice-primary/30 text-justice-primary hover:bg-justice-primary/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  Clear
                </Badge>
              )}
            </>
          ) : (
            <span className="flex items-center">
              <Search className="h-4 w-4 mr-2" /> All Jurisdictions
            </span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="p-0 w-[250px]" align="start">
        <Command>
          <CommandInput placeholder="Search jurisdictions..." />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No jurisdiction found.</CommandEmpty>
            
            <CommandGroup heading="Sacred Courts">
              {sacred.map((jurisdiction) => (
                <CommandItem
                  key={jurisdiction.id}
                  value={`${jurisdiction.id}-${jurisdiction.name}`}
                  onSelect={() => handleSelect(jurisdiction.id)}
                >
                  <span>{jurisdiction.name}</span>
                  {selectedJurisdiction === jurisdiction.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Continents">
              {continents.map((jurisdiction) => (
                <CommandItem
                  key={jurisdiction.id}
                  value={`${jurisdiction.id}-${jurisdiction.name}`}
                  onSelect={() => handleSelect(jurisdiction.id)}
                >
                  <span>{jurisdiction.name}</span>
                  {selectedJurisdiction === jurisdiction.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Countries">
              {countries.map((jurisdiction) => (
                <CommandItem
                  key={jurisdiction.id}
                  value={`${jurisdiction.id}-${jurisdiction.name}`}
                  onSelect={() => handleSelect(jurisdiction.id)}
                >
                  <span>{jurisdiction.name}</span>
                  {selectedJurisdiction === jurisdiction.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Courts">
              {courts.map((jurisdiction) => (
                <CommandItem
                  key={jurisdiction.id}
                  value={`${jurisdiction.id}-${jurisdiction.name}`}
                  onSelect={() => handleSelect(jurisdiction.id)}
                >
                  <span>{jurisdiction.name}</span>
                  {selectedJurisdiction === jurisdiction.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup>
              <CommandItem onSelect={handleClear} className="text-justice-light/70">
                <span>Clear filter</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

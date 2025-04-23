
import { Jurisdiction } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, ChevronRight, Globe, Check } from "lucide-react";

interface JurisdictionListProps {
  jurisdictions: Jurisdiction[];
  onJurisdictionSelect?: (jurisdiction: Jurisdiction) => void;
}

export function JurisdictionList({ jurisdictions, onJurisdictionSelect }: JurisdictionListProps) {
  const getLegalSystemBadge = (system: string) => {
    switch (system) {
      case "common_law":
        return <Badge className="bg-blue-500/20 text-blue-300">Common Law</Badge>;
      case "civil_law":
        return <Badge className="bg-green-500/20 text-green-300">Civil Law</Badge>;
      case "religious_law":
        return <Badge className="bg-purple-500/20 text-purple-300">Religious Law</Badge>;
      case "customary_law":
        return <Badge className="bg-orange-500/20 text-orange-300">Customary Law</Badge>;
      case "mixed":
        return <Badge className="bg-yellow-500/20 text-yellow-300">Mixed</Badge>;
      case "international_law":
        return <Badge className="bg-cyan-500/20 text-cyan-300">International Law</Badge>;
      case "humanitarian_law":
        return <Badge className="bg-red-500/20 text-red-300">Humanitarian Law</Badge>;
      case "un_charter":
        return <Badge className="bg-blue-700/20 text-blue-200">UN Charter</Badge>;
      case "treaty_based":
        return <Badge className="bg-teal-500/20 text-teal-300">Treaty-Based</Badge>;
      case "icc_rome_statute":
        return <Badge className="bg-violet-500/20 text-violet-300">ICC Rome Statute</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader className="bg-justice-dark text-white">
        <TableRow>
          <TableHead className="w-[50px]">Code</TableHead>
          <TableHead>Jurisdiction</TableHead>
          <TableHead>Legal System</TableHead>
          <TableHead>Region</TableHead>
          <TableHead className="text-center">Precedent Weight</TableHead>
          <TableHead className="text-center">Int'l</TableHead>
          <TableHead className="text-center">UN/ICC</TableHead>
          <TableHead className="text-center">Active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jurisdictions.map((jurisdiction) => (
          <TableRow key={jurisdiction.id} className="hover:bg-justice-dark/5">
            <TableCell className="font-mono">{jurisdiction.code}</TableCell>
            <TableCell className="font-medium">{jurisdiction.name}</TableCell>
            <TableCell>{getLegalSystemBadge(jurisdiction.legal_system)}</TableCell>
            <TableCell>{jurisdiction.region}</TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">{jurisdiction.precedent_weight.toFixed(2)}</span>
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-red-500 to-green-500" 
                  style={{ width: '50px', opacity: jurisdiction.precedent_weight }}
                ></div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              {jurisdiction.international_relevance ? (
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-justice-primary/10">
                    {jurisdiction.international_relevance.toFixed(1)}
                  </Badge>
                </div>
              ) : "-"}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-1">
                {jurisdiction.un_recognized && <Globe className="h-4 w-4 text-blue-400" />}
                {jurisdiction.icc_jurisdiction && <Check className="h-4 w-4 text-purple-400" />}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <Switch checked={jurisdiction.active} />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onJurisdictionSelect && onJurisdictionSelect(jurisdiction)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

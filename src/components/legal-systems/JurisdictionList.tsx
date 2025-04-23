
import { Jurisdiction } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, ChevronRight } from "lucide-react";

interface JurisdictionListProps {
  jurisdictions: Jurisdiction[];
}

export function JurisdictionList({ jurisdictions }: JurisdictionListProps) {
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
          <TableHead className="text-center">Cases</TableHead>
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
            <TableCell className="text-center">{jurisdiction.cases_count?.toLocaleString() || "0"}</TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <Switch checked={jurisdiction.active} />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

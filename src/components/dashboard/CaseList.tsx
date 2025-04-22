
import { Case } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CaseListProps {
  cases: Case[];
}

export function CaseList({ cases }: CaseListProps) {
  return (
    <Table>
      <TableHeader className="bg-justice-dark text-white">
        <TableRow>
          <TableHead className="w-[180px]">Case ID</TableHead>
          <TableHead className="w-[300px]">Title</TableHead>
          <TableHead>Principle</TableHead>
          <TableHead>Scroll Alignment</TableHead>
          <TableHead className="text-right">Confidence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((caseItem) => (
          <TableRow key={caseItem.case_id} className="hover:bg-justice-dark/5">
            <TableCell className="font-mono">{caseItem.case_id}</TableCell>
            <TableCell className="font-medium">{caseItem.title}</TableCell>
            <TableCell>{caseItem.principle}</TableCell>
            <TableCell className="max-w-xs truncate">{caseItem.scroll_alignment}</TableCell>
            <TableCell className="text-right">
              {getConfidenceBadge(caseItem.confidence)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 0.9) {
    return <Badge className="bg-principle-strong text-justice-dark">{(confidence * 100).toFixed(1)}%</Badge>;
  } else if (confidence >= 0.75) {
    return <Badge className="bg-principle-medium text-justice-dark">{(confidence * 100).toFixed(1)}%</Badge>;
  } else {
    return <Badge className="bg-principle-weak text-white">{(confidence * 100).toFixed(1)}%</Badge>;
  }
};

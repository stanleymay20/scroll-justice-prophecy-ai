
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language";

interface VerdictButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  disabled: boolean;
  loading: boolean;
}

export const VerdictButtons = ({
  onApprove,
  onReject,
  disabled,
  loading
}: VerdictButtonsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex space-x-4">
      <Button
        variant="default"
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={onApprove}
        disabled={loading || disabled}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        {t("verdict.approvePetition")}
      </Button>
      
      <Button
        variant="default"
        className="flex-1 bg-red-600 hover:bg-red-700"
        onClick={onReject}
        disabled={loading || disabled}
      >
        <XCircle className="mr-2 h-4 w-4" />
        {t("verdict.rejectPetition")}
      </Button>
    </div>
  );
};

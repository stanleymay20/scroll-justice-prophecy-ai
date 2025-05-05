
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/language";

interface ReasoningFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ReasoningField = ({
  value,
  onChange
}: ReasoningFieldProps) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <label className="text-sm text-justice-light">{t("verdict.reasoning")}</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("verdict.reasoningPlaceholder")}
        className="mt-1 h-32"
      />
    </div>
  );
};

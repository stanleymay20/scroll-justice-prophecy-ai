
import { ScrollText, Shield, Scale, Gavel } from "lucide-react";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useLanguage } from "@/contexts/language";

export const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <ScrollText className="h-6 w-6 text-justice-primary" />,
      title: t("features.precedents.title"),
      description: t("features.precedents.description"),
    },
    {
      icon: <Shield className="h-6 w-6 text-justice-primary" />,
      title: t("features.courtrooms.title"),
      description: t("features.courtrooms.description"),
    },
    {
      icon: <Scale className="h-6 w-6 text-justice-primary" />,
      title: t("features.analysis.title"),
      description: t("features.analysis.description"),
    },
    {
      icon: <Gavel className="h-6 w-6 text-justice-primary" />,
      title: t("features.trials.title"),
      description: t("features.trials.description"),
    },
  ];
  
  return (
    <div className="w-full max-w-7xl mx-auto mt-20">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <GlassCard key={index} className="p-6" glow={index === 1}>
            <div className="p-2 bg-justice-primary/20 rounded-lg w-fit mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-justice-light/80">{feature.description}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

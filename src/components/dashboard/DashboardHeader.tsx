
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";

export const DashboardHeader = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const username = user?.email?.split("@")[0] || "";
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        {t("app.title")} <span className="text-justice-primary">{t("nav.dashboard")}</span>
      </h1>
      <p className="text-justice-light/80">
        {t("dashboard.welcome", username)}
      </p>
    </div>
  );
};

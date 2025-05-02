
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";

export const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-28 flex flex-col items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-gradient-to-br from-justice-dark to-black h-full w-full" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t("app.title")}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-justice-light">
            {t("app.tagline")}
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate("/signin")}>
              {t("nav.signin")}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/signup")}>
              {t("button.register")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

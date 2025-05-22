
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useLanguage } from "@/contexts/language";
import { Scroll, Scale, FileText, Dna, Coin, BrokenChain } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

export const ScrollMenu = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const menuItems: MenuItem[] = [
    {
      id: "scrollCourt",
      label: t("scrollMenu.court", "Scroll Court"),
      path: "/ScrollCourt",
      icon: <Scroll className="h-6 w-6" />,
      description: t("scrollMenu.courtDesc", "Submit a petition for justice")
    },
    {
      id: "judgmentRoom",
      label: t("scrollMenu.judgment", "Judgment Room"),
      path: "/JudgmentRoom",
      icon: <Scale className="h-6 w-6" />,
      description: t("scrollMenu.judgmentDesc", "View petitions and verdicts")
    },
    {
      id: "scrollCry",
      label: t("scrollMenu.cry", "National ScrollCry"),
      path: "/ScrollCry",
      icon: <FileText className="h-6 w-6" />,
      description: t("scrollMenu.cryDesc", "Join the national declaration")
    },
    {
      id: "tribunal",
      label: t("scrollMenu.tribunal", "ScrollTribunal"),
      path: "/Tribunal",
      icon: <Scale className="h-6 w-6" />,
      description: t("scrollMenu.tribunalDesc", "Global historical justice court")
    },
    {
      id: "scrollBack",
      label: t("scrollMenu.scrollBack", "ScrollBack"),
      path: "/ScrollBack",
      icon: <Dna className="h-6 w-6" />,
      description: t("scrollMenu.scrollBackDesc", "Ancestry restoration program")
    },
    {
      id: "wealthLedger",
      label: t("scrollMenu.wealth", "ScrollWealth"),
      path: "/Wealth",
      icon: <Coin className="h-6 w-6" />,
      description: t("scrollMenu.wealthDesc", "Sacred reparations ledger")
    }
  ];
  
  // Define proper framer-motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-cinzel text-white mb-6">
        {t("scrollMenu.title", "Sacred Scroll Justice")}
      </h2>
      
      <motion.div 
        className="grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {menuItems.map((menuItem) => (
          <motion.div key={menuItem.id} variants={itemVariants}>
            <Button
              onClick={() => navigate(menuItem.path)}
              variant="outline"
              className="w-full justify-start text-left bg-black/20 border-justice-primary/30 hover:bg-justice-primary/20 py-6"
            >
              <div className="mr-4 p-2 rounded-full bg-justice-primary/20">
                {menuItem.icon}
              </div>
              <div>
                <div className="font-semibold text-white">{menuItem.label}</div>
                <div className="text-sm text-justice-light/70">{menuItem.description}</div>
              </div>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </GlassCard>
  );
};

export default ScrollMenu;

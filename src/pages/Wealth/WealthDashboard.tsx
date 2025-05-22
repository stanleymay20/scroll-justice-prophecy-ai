
import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ScrollWealthDebt } from "@/types/wealth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coin, BrokenChain, Globe, PieChart } from "lucide-react";

// Mock data for demo purposes
const mockDebts: ScrollWealthDebt[] = [
  {
    id: "wd-001",
    debtor_nation: "United Kingdom",
    owed_to_nation: "India",
    category: "Artifacts",
    estimated_value_usd: 4500000000,
    last_updated: new Date().toISOString(),
    tribunal_case_id: "tc-005"
  },
  {
    id: "wd-002",
    debtor_nation: "France",
    owed_to_nation: "Haiti",
    category: "Labor",
    estimated_value_usd: 21000000000,
    last_updated: new Date().toISOString(),
    tribunal_case_id: "tc-007"
  },
  {
    id: "wd-003",
    debtor_nation: "United States",
    owed_to_nation: "Multiple African Nations",
    category: "Labor",
    estimated_value_usd: 14000000000000,
    last_updated: new Date().toISOString(),
    tribunal_case_id: "tc-008"
  },
  {
    id: "wd-004",
    debtor_nation: "Netherlands",
    owed_to_nation: "Indonesia",
    category: "Gold",
    estimated_value_usd: 850000000,
    last_updated: new Date().toISOString(),
    tribunal_case_id: "tc-009"
  },
  {
    id: "wd-005",
    debtor_nation: "Spain",
    owed_to_nation: "Peru",
    category: "Gold",
    estimated_value_usd: 21500000000,
    last_updated: new Date().toISOString(),
    tribunal_case_id: "tc-010"
  },
  {
    id: "wd-006",
    debtor_nation: "Belgium",
    owed_to_nation: "Congo",
    category: "Land",
    estimated_value_usd: 3700000000,
    last_updated: new Date().toISOString(),
    tribunal_case_id: "tc-011"
  }
];

// Helper to format large currency amounts
const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000000) {
    return `$${(amount / 1000000000000).toFixed(1)} trillion`;
  }
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)} billion`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)} million`;
  }
  return `$${amount.toLocaleString()}`;
};

const WealthDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [debts, setDebts] = useState<ScrollWealthDebt[]>(mockDebts);
  const [selectedNation, setSelectedNation] = useState<string | null>(null);

  // Calculate totals
  const totalDebt = debts.reduce((sum, debt) => sum + debt.estimated_value_usd, 0);
  
  // Get unique debtor and creditor nations
  const debtorNations = Array.from(new Set(debts.map(d => d.debtor_nation)));
  const creditorNations = Array.from(new Set(debts.map(d => d.owed_to_nation)));
  
  // Filter debts by selected nation
  const filteredDebts = selectedNation ? 
    debts.filter(d => d.debtor_nation === selectedNation || d.owed_to_nation === selectedNation) : 
    debts;
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("wealth.title", "ScrollWealth Ledger")} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="mr-3 p-2 rounded-full bg-justice-primary/20">
            <Coin className="h-6 w-6 text-justice-light" />
            <BrokenChain className="h-6 w-6 text-justice-light mt-1" />
          </div>
          <h1 className="text-3xl font-cinzel text-white text-center">
            {t("wealth.title", "ScrollWealth: Sacred Ledger of Reparations")}
          </h1>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <GlassCard className="p-6 lg:col-span-3">
            <div className="text-center mb-4">
              <h2 className="text-xl font-cinzel text-white">Global Reparations Counter</h2>
              <div className="text-4xl md:text-5xl font-bold text-justice-primary my-4">
                {formatCurrency(totalDebt)}
              </div>
              <p className="text-justice-light text-sm">
                Total estimated value of historical wealth extraction
              </p>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="inline-flex rounded-md shadow-sm">
                <Button 
                  variant="outline"
                  className={!selectedNation ? "bg-justice-primary/20" : "bg-transparent"}
                  onClick={() => setSelectedNation(null)}
                >
                  All Nations
                </Button>
                {debtorNations.slice(0, 3).map(nation => (
                  <Button
                    key={nation}
                    variant="outline"
                    className={selectedNation === nation ? "bg-justice-primary/20" : "bg-transparent"}
                    onClick={() => setSelectedNation(nation)}
                  >
                    {nation}
                  </Button>
                ))}
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-5 w-5 mr-2 text-justice-light" />
              <h2 className="text-lg font-cinzel text-white">Top Debtor Nations</h2>
            </div>
            
            <div className="space-y-3">
              {debtorNations.map(nation => {
                const nationDebt = debts
                  .filter(d => d.debtor_nation === nation)
                  .reduce((sum, debt) => sum + debt.estimated_value_usd, 0);
                  
                return (
                  <div key={nation} className="flex justify-between items-center">
                    <span className="text-justice-light">{nation}</span>
                    <span className="text-justice-primary font-semibold">
                      {formatCurrency(nationDebt)}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <PieChart className="h-5 w-5 mr-2 text-justice-light" />
              <h2 className="text-lg font-cinzel text-white">Debt by Category</h2>
            </div>
            
            <div className="space-y-3">
              {(['Labor', 'Gold', 'Artifacts', 'Land', 'Wages'] as const).map(category => {
                const categoryDebt = debts
                  .filter(d => d.category === category)
                  .reduce((sum, debt) => sum + debt.estimated_value_usd, 0);
                  
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-justice-light">{category}</span>
                    <span className="text-justice-primary font-semibold">
                      {formatCurrency(categoryDebt)}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <BrokenChain className="h-5 w-5 mr-2 text-justice-light" />
              <h2 className="text-lg font-cinzel text-white">Major Recipients</h2>
            </div>
            
            <div className="space-y-3">
              {creditorNations.map(nation => {
                const nationCredit = debts
                  .filter(d => d.owed_to_nation === nation)
                  .reduce((sum, debt) => sum + debt.estimated_value_usd, 0);
                  
                return (
                  <div key={nation} className="flex justify-between items-center">
                    <span className="text-justice-light">{nation}</span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(nationCredit)}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
        
        <GlassCard className="p-6">
          <h2 className="text-xl font-cinzel text-white mb-4">Sacred Wealth Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-justice-light uppercase bg-black/30">
                <tr>
                  <th scope="col" className="px-4 py-3">Debtor Nation</th>
                  <th scope="col" className="px-4 py-3">Owed To</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Estimated Value</th>
                  <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebts.map((debt) => (
                  <tr key={debt.id} className="border-b border-gray-700 hover:bg-black/20">
                    <td className="px-4 py-3 font-medium text-white">
                      {debt.debtor_nation}
                    </td>
                    <td className="px-4 py-3 text-justice-light">
                      {debt.owed_to_nation}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${debt.category === 'Labor' ? 'bg-red-900/30 text-red-300' : 
                          debt.category === 'Gold' ? 'bg-yellow-900/30 text-yellow-300' :
                          debt.category === 'Artifacts' ? 'bg-purple-900/30 text-purple-300' :
                          debt.category === 'Land' ? 'bg-green-900/30 text-green-300' :
                          'bg-blue-900/30 text-blue-300'
                        }`}
                      >
                        {debt.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-justice-primary font-semibold">
                      {formatCurrency(debt.estimated_value_usd)}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Case
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default WealthDashboard;

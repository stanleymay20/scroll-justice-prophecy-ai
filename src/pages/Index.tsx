
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavBar } from "@/components/layout/NavBar";
import { ScrollText, Shield, Scale, Gavel } from "lucide-react";
import { AnimatedValue } from "@/components/advanced-ui/AnimatedValue";
import { SystemMetricsPanel } from "@/components/dashboard/SystemMetricsPanel";
import { CaseList } from "@/components/dashboard/CaseList";
import { ScrollPhaseIndicator } from "@/components/dashboard/ScrollPhaseIndicator";
import { MetaTags } from "@/components/MetaTags";

// Mock data for demo purposes
const mockSystemHealth = {
  overall: 96.5,
  delta: 2.3,
  cases_analyzed: 1250,
  precedent_accuracy: 94.2,
  jurisdictional_coverage: 89.7
};

const mockCases = [
  {
    case_id: "SCJ-2025-042",
    title: "Sacred Principles of Digital Evidence",
    principle: "Truth Preservation",
    scroll_alignment: "DAWN Phase, Gate 3",
    confidence: 0.95
  },
  {
    case_id: "SCJ-2025-039",
    title: "Global Jurisdictional Boundaries",
    principle: "Equitable Access",
    scroll_alignment: "RISE Phase, Gate 5",
    confidence: 0.88
  },
  {
    case_id: "SCJ-2025-036",
    title: "AI Witness Credibility Assessment",
    principle: "Technological Integrity",
    scroll_alignment: "ASCEND Phase, Gate 2",
    confidence: 0.72
  }
];

// Current scroll phase and gate
const currentScrollPhase = "RISE";
const currentScrollGate = 4;

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Log mount for debugging
  useEffect(() => {
    console.log("Index page mounted");
  }, []);

  const features = [
    {
      icon: <ScrollText className="h-6 w-6 text-justice-primary" />,
      title: "Sacred Precedents",
      description: "Access the ancient scroll library of legal precedents and principles",
    },
    {
      icon: <Shield className="h-6 w-6 text-justice-primary" />,
      title: "Secure Courtrooms",
      description: "Participate in encrypted sacred court sessions with oath protection",
    },
    {
      icon: <Scale className="h-6 w-6 text-justice-primary" />,
      title: "Justice Analysis",
      description: "Gain insights from advanced scroll analytics and pattern recognition",
    },
    {
      icon: <Gavel className="h-6 w-6 text-justice-primary" />,
      title: "Simulation Trials",
      description: "Practice in safe, simulated court environments before real proceedings",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={user ? "Dashboard" : "Welcome"} />
      <NavBar />
      
      {user ? (
        // Dashboard for authenticated users
        <div className="pt-20 pb-16 px-4 container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {t("app.title")} <span className="text-justice-primary">Dashboard</span>
            </h1>
            <p className="text-justice-light/80">
              Welcome back, {user.email?.split("@")[0]}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sacred Justice Metrics</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-justice-light/70 text-sm mb-1">Active Cases</p>
                    <AnimatedValue 
                      value={23} 
                      className="text-2xl font-bold text-white"
                    />
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-justice-light/70 text-sm mb-1">Courts</p>
                    <AnimatedValue 
                      value={7} 
                      className="text-2xl font-bold text-white"
                    />
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-justice-light/70 text-sm mb-1">Precedents</p>
                    <AnimatedValue 
                      value={342} 
                      className="text-2xl font-bold text-white"
                    />
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-justice-light/70 text-sm mb-1">Justice Score</p>
                    <AnimatedValue 
                      value={98.7} 
                      decimals={1}
                      suffix="%"
                      className="text-2xl font-bold text-white"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button onClick={() => navigate("/precedent")}>
                    Browse Precedents
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/case-classification")}>
                    Case Classification
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-justice-tertiary hover:bg-justice-tertiary/80"
                    onClick={() => navigate("/simulation-trial")}
                  >
                    Start Simulation Trial
                  </Button>
                </div>
              </GlassCard>
              
              <SystemMetricsPanel data={mockSystemHealth} />
              
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Cases</h2>
                <CaseList cases={mockCases} />
              </GlassCard>
            </div>
            
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sacred Scroll Phase</h2>
                <ScrollPhaseIndicator 
                  phase={currentScrollPhase as any} 
                  gate={currentScrollGate as any} 
                />
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate("/scroll-time")}
                >
                  View Scroll Calendar
                </Button>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/document-upload")}
                  >
                    <ScrollText className="mr-2 h-4 w-4" />
                    Upload Evidence
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/community")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Community Forum
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/principles")}
                  >
                    <Scale className="mr-2 h-4 w-4" />
                    Sacred Principles
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/analytics")}
                  >
                    <Gavel className="mr-2 h-4 w-4" />
                    Justice Analytics
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      ) : (
        // Landing page for unauthenticated users
        <>
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
                    Register
                  </Button>
                </div>
              </div>
            </div>

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
          </div>

          <div className="bg-justice-dark/50">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Sacred Justice for the Digital Age
                  </h2>
                  <p className="mt-3 max-w-3xl text-lg text-justice-light">
                    ScrollJustice.AI combines ancient wisdom with cutting-edge technology to deliver a 
                    revolutionary legal platform. Access precedents, participate in secure court sessions, 
                    and receive AI-powered insights.
                  </p>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Shield className="h-6 w-6 text-justice-primary" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-white">Secure & Encrypted</h3>
                        <p className="mt-2 text-justice-light/80">
                          All court sessions and evidence are protected by ScrollSeal encryption.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-6">
                      <div className="flex-shrink-0">
                        <ScrollText className="h-6 w-6 text-justice-primary" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-white">Ancient Knowledge</h3>
                        <p className="mt-2 text-justice-light/80">
                          Access thousands of years of legal precedents and sacred principles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0">
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Experience Sacred Justice</h3>
                    <p className="text-justice-light/80 mb-6">
                      Join thousands of legal professionals already using ScrollJustice.AI to transform their practice.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate("/subscription/plans")}
                    >
                      View Sacred Plans
                    </Button>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;

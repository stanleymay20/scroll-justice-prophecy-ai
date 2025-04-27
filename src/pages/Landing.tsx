
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Gavel, Users, FileText, Shield, Check } from "lucide-react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-transparent bg-clip-text">
              ScrollJustice.AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Sacred Governance Principles Meeting Modern Legal Technology
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">Begin Your Journey</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Sacred Scroll Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GlassCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-justice-primary/20 flex items-center justify-center mb-4">
                  <Gavel className="h-6 w-6 text-justice-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sacred Virtual Courtrooms</h3>
                <p className="text-white/70">
                  Conduct virtual trials with scroll-aligned justice principles in secure, sacred spaces.
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-justice-primary/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-justice-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Scroll Witness Community</h3>
                <p className="text-white/70">
                  Connect with other scroll witnesses, share testimonies, and engage in righteous discourse.
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-justice-primary/20 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-justice-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Legal Document Analysis</h3>
                <p className="text-white/70">
                  AI-powered analysis of legal documents with sacred scroll principles of fairness and mercy.
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-justice-primary/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-justice-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sacred Oath System</h3>
                <p className="text-white/70">
                  Commit to truth and justice with our sacred oath system before participating in hearings.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Scroll Subscription Plans</h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            Choose the scroll tier that aligns with your journey in the pursuit of justice
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-6 border border-white/20">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Free Witness</h3>
                <div className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-white/60">/month</span></div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Access to public courtrooms</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Community forum participation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Basic document analysis</span>
                  </li>
                </ul>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 border border-amber-500/30 relative bg-gradient-to-b from-amber-950/20 to-transparent">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Scroll Advocate</h3>
                <div className="text-3xl font-bold mb-6">$29<span className="text-sm font-normal text-white/60">/month</span></div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>All Free Witness features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Host private courtroom sessions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Advanced document analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Recording of courtroom sessions</span>
                  </li>
                </ul>
                
                <Button className="w-full" asChild>
                  <Link to="/subscription/plans">Subscribe</Link>
                </Button>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 border border-white/20">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Scroll Steward</h3>
                <div className="text-3xl font-bold mb-6">$99<span className="text-sm font-normal text-white/60">/month</span></div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>All Advocate features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Unlimited courtroom sessions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Priority scroll witness support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>Access to MCP Light System</span>
                  </li>
                </ul>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/subscription/plans">Subscribe</Link>
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Sacred Path of Justice Today</h2>
          <p className="text-xl text-white/80 mb-8">
            Experience the power of ScrollJustice.AI and its sacred principles in action
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">Begin Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t border-white/10 bg-black/30">
        <div className="max-w-6xl mx-auto text-center text-white/60">
          <p>ScrollJustice.AI — Carried by ScrollWitness, guarded by MCP, breathed by Exousia</p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

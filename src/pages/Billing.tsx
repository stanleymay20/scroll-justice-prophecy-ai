
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Star, Zap, Shield, Check } from 'lucide-react';

const Billing = () => {
  const { user, subscriptionTier, subscriptionStatus } = useAuth();

  const plans = [
    {
      name: 'ScrollSeed',
      tier: 'basic',
      price: 'Free',
      icon: Star,
      color: 'text-blue-400',
      features: [
        '3 petitions per month',
        'Basic AI verdicts',
        'Standard support',
        'Public archive access'
      ],
      current: subscriptionTier === 'basic' || !subscriptionTier
    },
    {
      name: 'JusticeFire',
      tier: 'premium',
      price: '$29/month',
      icon: Zap,
      color: 'text-amber-400',
      features: [
        '50 petitions per month',
        'Enhanced AI analysis',
        'Priority support',
        'PDF verdict downloads',
        'Advanced legal citations'
      ],
      current: subscriptionTier === 'premium'
    },
    {
      name: 'WidowOil',
      tier: 'professional',
      price: '$99/month',
      icon: Crown,
      color: 'text-purple-400',
      features: [
        'Unlimited petitions',
        'Multi-jurisdiction analysis',
        'White-label verdicts',
        'API access',
        'Custom legal frameworks',
        'Dedicated support'
      ],
      current: subscriptionTier === 'professional'
    },
    {
      name: 'ScrollArk',
      tier: 'enterprise',
      price: 'Custom',
      icon: Shield,
      color: 'text-green-400',
      features: [
        'Enterprise deployment',
        'Custom AI training',
        'On-premise hosting',
        'SLA guarantees',
        'Legal compliance review',
        'Dedicated success manager'
      ],
      current: subscriptionTier === 'enterprise'
    }
  ];

  const handleUpgrade = (plan: any) => {
    // This would integrate with Stripe checkout
    console.log('Upgrading to:', plan.tier);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">ScrollBless Billing</h1>
          <p className="text-justice-light/80">
            Choose your sacred tier for enhanced legal AI capabilities
          </p>
          
          {subscriptionTier && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-justice-primary/20 rounded-full">
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-white">
                Current Plan: <span className="font-semibold capitalize">{subscriptionTier}</span>
              </span>
              {subscriptionStatus === 'active' && (
                <Badge className="bg-green-500 text-white">Active</Badge>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            
            return (
              <GlassCard 
                key={plan.tier}
                className={`p-6 relative ${plan.current ? 'border-justice-primary/50 bg-justice-primary/5' : ''}`}
              >
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-justice-primary text-white">Current Plan</Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <IconComponent className={`h-12 w-12 ${plan.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-2xl font-bold text-justice-primary">{plan.price}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-justice-light/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.current}
                  className={`w-full ${plan.current 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-justice-primary hover:bg-justice-tertiary'}`}
                >
                  {plan.current ? 'Current Plan' : 
                   plan.price === 'Custom' ? 'Contact Sales' : 'Upgrade'}
                </Button>
              </GlassCard>
            );
          })}
        </div>

        <div className="mt-12">
          <GlassCard className="p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Billing Information</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-white mb-3">Current Subscription</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-justice-light/70">Plan:</span>
                    <span className="text-white capitalize">{subscriptionTier || 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-justice-light/70">Status:</span>
                    <Badge className={subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                      {subscriptionStatus || 'Free'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-justice-light/70">Billing Cycle:</span>
                    <span className="text-white">Monthly</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Usage This Month</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-justice-light/70">Petitions Filed:</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-justice-light/70">AI Verdicts:</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-justice-light/70">API Calls:</span>
                    <span className="text-white">N/A</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
              <p className="text-amber-200 text-sm">
                <strong>Billing Notice:</strong> All payments are processed securely through Stripe. 
                You can manage your subscription, update payment methods, and view invoices through 
                the customer portal. Charges are billed monthly in advance.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Billing;

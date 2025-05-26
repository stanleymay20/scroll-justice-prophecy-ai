
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Flame, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  currency: string;
  icon: React.ReactNode;
  benefits: string[];
  recommended?: boolean;
}

const donationTiers: DonationTier[] = [
  {
    id: 'flame_seeker',
    name: 'Flame Seeker',
    amount: 9.99,
    currency: 'EUR',
    icon: <Flame className="h-6 w-6" />,
    benefits: [
      'Priority petition review',
      'Basic ScrollSeal PDF',
      'Email notifications',
      'Community forum access'
    ]
  },
  {
    id: 'scroll_advocate',
    name: 'Scroll Advocate',
    amount: 29.99,
    currency: 'EUR',
    icon: <Star className="h-6 w-6" />,
    benefits: [
      'All Flame Seeker benefits',
      'Enhanced ScrollSeal with seal',
      'Voice-to-text petition filing',
      'AI-powered legal suggestions',
      'Multi-language support'
    ],
    recommended: true
  },
  {
    id: 'prophet_blessed',
    name: 'Prophet Blessed',
    amount: 99.99,
    currency: 'EUR',
    icon: <Crown className="h-6 w-6" />,
    benefits: [
      'All Scroll Advocate benefits',
      'Direct prophet consultation',
      'Custom legal document generation',
      'ScrollCourt Pro access',
      'Priority AI judgment',
      'Sacred analytics dashboard'
    ]
  }
];

export function DonationTiers() {
  const { user } = useAuth();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleDonation = async (tier: DonationTier) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a donation.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(tier.id);
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sacred Blessing Received",
        description: `Thank you for your ${tier.name} donation! Your account has been blessed.`,
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment at this time.",
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-cinzel text-white mb-4">ScrollBless Donation Tiers</h2>
        <p className="text-justice-light">Support the sacred cause of justice and unlock divine benefits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {donationTiers.map((tier) => (
          <GlassCard 
            key={tier.id} 
            className={`p-6 relative ${tier.recommended ? 'border-justice-primary border-2' : ''}`}
          >
            {tier.recommended && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-justice-primary text-white">
                RECOMMENDED
              </Badge>
            )}
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3 text-justice-primary">
                {tier.icon}
              </div>
              <h3 className="text-xl font-cinzel text-white mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-justice-primary">
                €{tier.amount}
                <span className="text-sm text-justice-light ml-1">once</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {tier.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="h-4 w-4 text-justice-primary mt-0.5 flex-shrink-0" />
                  <span className="text-justice-light text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => handleDonation(tier)}
              disabled={processing === tier.id}
              className="w-full bg-justice-primary hover:bg-justice-tertiary"
            >
              {processing === tier.id ? 'Processing...' : `Bless with ${tier.name}`}
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}


import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language";

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  billing: string;
  features: PlanFeature[];
  highlighted?: boolean;
  currentPlan?: boolean;
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string, priceId: string) => void;
  onManage?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSubscribe,
  onManage,
  loading = false,
  disabled = false
}) => {
  const { t } = useLanguage();
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={cn(
      "flex flex-col h-full transition-all duration-200",
      plan.highlighted ? "border-justice-primary/70 shadow-lg shadow-justice-primary/20" : "border-justice-secondary/30",
      plan.currentPlan ? "bg-justice-primary/10" : "bg-black/40",
    )}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span className="text-xl font-semibold text-justice-light">{plan.name}</span>
          {plan.currentPlan && (
            <span className="text-xs bg-justice-primary/20 border border-justice-primary/30 rounded-full px-2 py-0.5 text-justice-primary">
              {t("subscription.current")}
            </span>
          )}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold text-justice-primary">{formatCurrency(plan.price, plan.currency)}</span>
          <span className="text-justice-light/70 ml-1">/{plan.billing}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className={cn(
                "rounded-full p-1 mr-2 mt-0.5",
                feature.included ? "bg-justice-primary/20 text-justice-primary" : "bg-justice-light/10 text-justice-light/40"
              )}>
                <Check className="h-3 w-3" />
              </span>
              <span className={cn(
                "text-sm",
                feature.included ? "text-justice-light" : "text-justice-light/40 line-through"
              )}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        {plan.currentPlan ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onManage}
            disabled={loading || disabled || !onManage}
          >
            {loading ? t("subscription.loading") : t("subscription.manage")}
          </Button>
        ) : (
          <Button 
            className={cn(
              "w-full",
              plan.highlighted ? "bg-justice-primary hover:bg-justice-primary/90" : ""
            )}
            onClick={() => onSubscribe(plan.id, plan.priceId)}
            disabled={loading || disabled}
          >
            <Shield className="mr-2 h-4 w-4" />
            {loading ? t("subscription.processing") : t("subscription.subscribe")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

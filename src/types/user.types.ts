type SubscriptionPlan = "free" | "basic" | "premium" | "admin" | null;

export interface PremiumButtonProps {
  userPlan: SubscriptionPlan;
  onSimpleObjectCreate: () => void;
  onApiIntegrationCreate: () => void;
}

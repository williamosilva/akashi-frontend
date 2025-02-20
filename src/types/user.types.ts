type SubscriptionPlan = "free" | "basic" | "premium" | "admin";

export interface PremiumButtonProps {
  userPlan: SubscriptionPlan;
  onSimpleObjectCreate: () => void;
  onApiIntegrationCreate: () => void;
}

import { ApiService } from "./api.service";

export class PaymentService extends ApiService {
  private static instance: PaymentService;

  private constructor() {
    super();
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  static getToken() {
    return localStorage.getItem("accessToken");
  }

  /**
   * Creates a checkout session for subscription
   * @param email User email
   * @param planType Subscription plan type ('basic' or 'premium')
   * @returns Checkout URL and session token
   */
  public async createCheckoutSession(
    email: string,
    planType: "basic" | "premium"
  ): Promise<{
    checkoutUrl: string;
    sessionToken: string;
  }> {
    return this.request<{
      checkoutUrl: string;
      sessionToken: string;
    }>("/payments/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        planType,
      }),
    });
  }

  /**
   * Verifies a session token after payment
   * @param token Session token to verify
   * @returns Verification result
   */
  public async verifySessionToken(token: string): Promise<{
    valid: boolean;
    message?: string;
    email?: string;
    planType?: "basic" | "premium";
  }> {
    return this.request<{
      valid: boolean;
      message?: string;
      email?: string;
      planType?: "basic" | "premium";
    }>(`/payments/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });
  }

  public async verifyToken(token: string): Promise<{
    valid: boolean;
    message?: string;
    email?: string;
    planType?: "basic" | "premium";
  }> {
    return this.request<{
      valid: boolean;
      message?: string;
      email?: string;
      planType?: "basic" | "premium";
    }>(`/payments/verify-subscription/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Checks if a user has an active subscription
   * @param email User email
   * @returns Subscription status and plan if active
   */
  public async verifySubscription(): Promise<{
    hasActiveSubscription: boolean;
    subscription: { plan: "basic" | "premium" } | null;
  }> {
    return this.request<{
      hasActiveSubscription: boolean;
      subscription: { plan: "basic" | "premium" } | null;
    }>(`/payments/verify-subscription`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PaymentService.getToken()}`,
      },
    });
  }

  /**
   * Cancels an active subscription
   * @param email User email
   * @returns Cancellation result
   */
  public async cancelSubscription(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/payments/subscription/${email}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  /**
   * Gets subscription details for a user
   * @param email User email
   * @returns Subscription details if found
   */
  public async getSubscriptionDetails(email: string): Promise<{
    plan: "basic" | "premium";
    stripeSubscriptionId: string;
    endsAt: string;
    createdAt: string;
  } | null> {
    return this.request<{
      plan: "basic" | "premium";
      stripeSubscriptionId: string;
      endsAt: string;
      createdAt: string;
    } | null>(`/payments/subscription/details/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

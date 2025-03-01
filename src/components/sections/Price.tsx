"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { plans } from "@/data";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { useState, useEffect, useContext } from "react";
import { PaymentService } from "@/services/payment.service";
import { useHook, UserContext } from "@/components/ui/ConditionalLayout";

const PlanCard = ({
  plan,
  isCurrentPlan,
  isLoading,
  onChoosePlan,
}: {
  plan: (typeof plans)[0];
  isCurrentPlan: boolean;
  isLoading: boolean;
  onChoosePlan: () => void;
}) => {
  const isPremium = plan.name === "Premium";

  const showCurrentPlan = isCurrentPlan || plan.type === "free";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg p-6 border transition-all h-full duration-300 ease-in-out",
        "border-zinc-700 bg-[#202022]",
        "hover:shadow-lg hover:shadow-zinc-700/20",
        isPremium && "scale-100"
      )}
    >
      <div className="relative z-10 h-full flex flex-col">
        <h3
          className={cn(
            "text-2xl font-bold mb-2",
            montserrat.className,
            isPremium ? "text-teal-300" : "text-emerald-300"
          )}
        >
          {plan.name}
        </h3>
        <p className={cn("text-5xl font-bold mb-6", jetbrainsMono.className)}>
          <span
            className={cn(
              "bg-clip-text text-transparent",
              isPremium
                ? "bg-gradient-to-r from-teal-400 to-teal-600"
                : "bg-gradient-to-r from-emerald-400 to-emerald-600"
            )}
          >
            {plan.price}
          </span>
          <span className="text-zinc-400 text-base font-normal">/month</span>
        </p>
        <ul className="mb-8 space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-zinc-200">
              <Check
                className={cn(
                  "h-5 w-5 mr-2",
                  isPremium ? "text-teal-500" : "text-emerald-500"
                )}
              />
              <span>{feature}</span>
            </li>
          ))}
          {plan.notIncluded.map((feature, i) => (
            <li key={i} className="flex items-center text-zinc-400">
              <X className="h-5 w-5 text-zinc-600 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {showCurrentPlan ? (
          <div className="h-12 flex mt-auto items-center justify-center select-none">
            <p className="text-center text-zinc-400 font-semibold">
              Current Plan
            </p>
          </div>
        ) : (
          <button
            onClick={onChoosePlan}
            disabled={isLoading}
            className={cn(
              "w-full px-6 py-3 mt-auto rounded-lg font-semibold transition-colors",
              isPremium
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? "Loading..." : "Choose Plan"}
          </button>
        )}
      </div>
    </div>
  );
};

export default function PriceSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free");
  const paymentService = PaymentService.getInstance();
  const { setOpenAuthModal } = useHook();

  const { email } = useContext(UserContext);

  const verifySubscription = async () => {
    try {
      setIsLoading(true);

      if (!email) {
        setCurrentPlan("Free");
        return;
      }

      const response = await paymentService.verifySubscription();

      if (response.hasActiveSubscription && response.subscription) {
        setCurrentPlan(
          response.subscription.plan === "premium" ? "Premium" : "Basic"
        );
      } else {
        setCurrentPlan("Free");
      }
    } catch (error) {
      console.error("Error verifying subscription:", error);
      setCurrentPlan("Free");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoosePlan = async (planType: "basic" | "premium") => {
    try {
      setIsLoading(true);

      if (!email) {
        setOpenAuthModal(true);
        return;
      }

      const { checkoutUrl } = await paymentService.createCheckoutSession(
        email,
        planType
      );

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(
        "The payment process could not be started. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      verifySubscription();
    }
  }, [email]);

  return (
    <div className="min-h-screen w-full py-24 ">
      <div className=" mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2
            className={cn(
              "text-4xl sm:text-5xl font-bold mb-4 tracking-tight",
              montserrat.className
            )}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500">
              Choose Your Plan
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
            Select the perfect plan to power your projects and transform your
            workflow.
          </p>
          {/* {isLoading && (
            <p className="mt-4 text-zinc-400">Verificando seu plano atual...</p>
          )}
          {!isLoading && currentPlan !== "Free" && (
            <p className="mt-4 text-teal-400 font-semibold">
              Você está atualmente no plano {currentPlan}
            </p>
          )} */}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              isCurrentPlan={currentPlan === plan.name}
              isLoading={isLoading}
              onChoosePlan={() => {
                if (plan.name === "Basic") {
                  handleChoosePlan("basic");
                } else if (plan.name === "Premium") {
                  handleChoosePlan("premium");
                } else {
                  setCurrentPlan("Free");
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

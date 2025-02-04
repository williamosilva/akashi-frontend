"use client";

import { JetBrains_Mono, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
});

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Create 1 project",
      "Basic Data Management",
      "Limited API access",
    ],
    notIncluded: ["Multiple projects", "API integration"],
    color: "emerald",
  },
  {
    name: "Pro",
    price: "$4",
    features: [
      "Create up to 5 projects",
      "Basic Data Management",
      "Limited API access",
      "Priority support",
    ],
    notIncluded: ["API integration"],
    color: "green",
  },
  {
    name: "Premium",
    price: "$5",
    features: [
      "Create up to 10 projects",
      "Advanced API Features",
      "API integration for all projects",
      "24/7 Premium support",
    ],
    notIncluded: [],
    color: "teal",
  },
];

const PlanCard = ({
  plan,
  isCurrentPlan,
  onChoosePlan,
}: {
  plan: (typeof plans)[0];
  isCurrentPlan: boolean;
  onChoosePlan: () => void;
}) => {
  const isPremium = plan.name === "Premium";

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
        {isCurrentPlan ? (
          <div className="h-12 flex mt-auto items-center justify-center select-none">
            <p className="text-center text-zinc-400 font-semibold">
              Current Plan
            </p>
          </div>
        ) : (
          <button
            onClick={onChoosePlan}
            className={cn(
              "w-full px-6 py-3 mt-auto rounded-lg font-semibold transition-colors",
              isPremium
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            )}
          >
            Choose Plan
          </button>
        )}
      </div>
    </div>
  );
};

export default function PriceSection() {
  const [mounted, setMounted] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full py-24 ">
      <div className="container mx-auto px-4 md:px-6">
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
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              isCurrentPlan={currentPlan === plan.name}
              onChoosePlan={() => setCurrentPlan(plan.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

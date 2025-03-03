"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Sparkles, Loader2 } from "lucide-react";
import { PremiumButtonProps } from "@/types/user.types";
import { PaymentService } from "@/services/payment.service";
import { useUser } from "../Layout/ConditionalLayout";
import { useState } from "react";

const SparkleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: Math.random() * 2,
              delay: Math.random() * 2,
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Star className="text-white" size={8} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function PremiumButtonEmpty({
  userPlan,
  onSimpleObjectCreate,
  onApiIntegrationCreate,
}: PremiumButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSimpleLoading, setIsSimpleLoading] = useState(false);
  const paymentService = PaymentService.getInstance();
  const { email } = useUser();

  const onUpgradeClick = async () => {
    try {
      setIsLoading(true);

      const { checkoutUrl } = await paymentService.createCheckoutSession(
        email || "",
        "premium"
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

  const handleSimpleObjectCreate = async () => {
    try {
      setIsSimpleLoading(true);
      await onSimpleObjectCreate();
    } catch (error) {
      console.error("Error creating simple object:", error);
    } finally {
      setIsSimpleLoading(false);
    }
  };

  const canAccessApiIntegration =
    userPlan === "premium" || userPlan === "admin";

  return (
    <div className="flex gap-4 font-sans h-full md:w-[500px] w-full flex-grow sm:flex-row flex-col">
      <button
        onClick={handleSimpleObjectCreate}
        disabled={isSimpleLoading}
        className="w-full sm:h-auto h-28 relative px-4 py-3 rounded-lg bg-zinc-800 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-zinc-700 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSimpleLoading ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Plus size={16} className="sm:mr-2 mr-0" />
        )}
        {isSimpleLoading ? "Creating..." : "Create Simple Object"}
      </button>

      <div className="relative w-full sm:h-auto h-28 ">
        <button
          onClick={() => {
            if (canAccessApiIntegration) {
              onApiIntegrationCreate();
            }
          }}
          className={`w-full h-full whitespace-nowrap relative flex-grow px-4 py-3 rounded-lg border h-[54px] sm:h-full text-sm font-medium transition-all flex items-center justify-center ${
            canAccessApiIntegration
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
              : "bg-zinc-800 border-zinc-700 text-zinc-500"
          }`}
        >
          <Plus size={16} className="sm:mr-2 mr-0" />
          Create API Integration
          {!canAccessApiIntegration && (
            <div className="absolute inset-0 rounded-lg bg-zinc-800 bg-opacity-80 flex flex-col items-center justify-center gap-10 p-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                  Premium Content
                </span>
              </div>
              <button
                onClick={onUpgradeClick}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-85 hover:scale-105 text-white text-sm font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <Sparkles size={16} className="text-white" />
                )}
                {isLoading ? "Processing..." : "Upgrade your Plan"}
              </button>
            </div>
          )}
        </button>
        {canAccessApiIntegration && <SparkleEffect />}
      </div>
    </div>
  );
}

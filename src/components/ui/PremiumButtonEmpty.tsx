"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Star, Plus, Heart, Sparkles } from "lucide-react";
import { PremiumButtonProps } from "@/types/user.types";

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
  const onUpgradeClick = () => {};
  const canAccessApiIntegration =
    userPlan === "premium" || userPlan === "admin";

  return (
    <div className="flex gap-4 font-sans h-full w-full flex-grow sm:flex-row flex-col">
      <button
        onClick={onSimpleObjectCreate}
        className=" w-full relative px-4 py-3 rounded-lg bg-zinc-800 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-zinc-700 transition-all flex items-center justify-center"
      >
        <Plus size={16} className="sm:mr-2 mr-0" />
        Create Simple Object
      </button>

      <div className="relative  w-full h-auto ">
        <button
          onClick={() => {
            if (canAccessApiIntegration) {
              onApiIntegrationCreate();
            }
          }}
          disabled={!canAccessApiIntegration}
          className={`w-full relative flex-grow px-4 py-3 rounded-lg border h-[54px] sm:h-full text-sm font-medium transition-all flex items-center justify-center ${
            canAccessApiIntegration
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
              : "bg-zinc-800 border-zinc-700 text-zinc-500 "
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
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="text-white" />
                Upgrade your Plan
              </button>
            </div>
          )}
        </button>
        {canAccessApiIntegration && <SparkleEffect />}
      </div>
    </div>
  );
}

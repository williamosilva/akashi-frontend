"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Star, Plus, ChevronDown } from "lucide-react";
import { PremiumButtonProps } from "@/types/user.types";

const SparkleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {[...Array(3)].map((_, i) => (
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
            <Star className="text-yellow-300" size={8} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function PremiumButton({
  userPlan,
  onSimpleObjectCreate,
  onApiIntegrationCreate,
}: PremiumButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const canAccessApiIntegration =
    userPlan === "premium" || userPlan === "admin";

  // Função para lidar com cliques fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="px-3 py-2 rounded-lg bg-zinc-800 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-zinc-700 transition-all flex items-center"
      >
        <Plus size={14} className="mr-1" />
        Create Object
        <ChevronDown
          size={14}
          className={`ml-1 transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full z-[4] right-0 mt-1 w-48 py-1 bg-zinc-800 border border-emerald-500/20 rounded-lg shadow-lg"
          >
            <button
              className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
              onClick={() => {
                onSimpleObjectCreate();
                setDropdownOpen(false);
              }}
            >
              Create Simple Object
            </button>
            <div className="relative">
              <button
                className={`w-full px-4 py-2 text-left text-sm ${
                  canAccessApiIntegration
                    ? "text-zinc-300 hover:bg-zinc-700"
                    : "text-zinc-600 cursor-not-allowed"
                } transition-colors`}
                onClick={() => {
                  if (canAccessApiIntegration) {
                    onApiIntegrationCreate();
                    setDropdownOpen(false);
                  }
                }}
                disabled={!canAccessApiIntegration}
              >
                Create API Integration
                {!canAccessApiIntegration && (
                  <motion.span
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Lock
                      size={8}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                    />
                    <span className="text-[10px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wide">
                      ONLY PREMIUM
                    </span>
                  </motion.span>
                )}
              </button>
              {canAccessApiIntegration && <SparkleEffect />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

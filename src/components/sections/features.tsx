"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Brain, Cloud, Zap, Shield } from "lucide-react";
import { useMousePosition } from "@/hooks/useMousePosition";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});

const features = [
  {
    name: "Dynamic Integration",
    description:
      "Seamlessly connect and manage your project data through our intuitive API.",
    icon: Cloud,
  },
  {
    name: "Intelligent Processing",
    description:
      "Advanced algorithms efficiently process and structure form submissions.",
    icon: Brain,
  },
  {
    name: "Real-time Updates",
    description:
      "Instantly reflect changes without modifying the original codebase.",
    icon: Zap,
  },
  {
    name: "Secure Handling",
    description:
      "Enterprise-grade security measures protect your valuable project information.",
    icon: Shield,
  },
];
// @ts-ignore
function FeatureCard({ feature, index }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updateGradient = () => {
      const rect = card.getBoundingClientRect();
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    card.addEventListener("mousemove", updateGradient);

    return () => {
      card.removeEventListener("mousemove", updateGradient);
    };
  }, [mousePosition]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative "
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(52,211,153,0.1)_10%,transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      <div className="relative flex flex-col items-center text-center p-8 rounded-lg transition-all duration-300 bg-zinc-800/50 border border-emerald-500/10 h-full hover:border-emerald-500/20 z-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors duration-300">
          <feature.icon className="h-8 w-8 text-emerald-400" />
        </div>
        <h3
          className={cn(
            "text-xl font-medium text-zinc-100 mb-4",
            jetbrainsMono.className
          )}
        >
          {feature.name}
        </h3>
        <p className="text-sm text-zinc-400">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-24 bg-zinc-900 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-zinc-400",
            jetbrainsMono.className
          )}
        >
          Cutting-Edge Solutions
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.name} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

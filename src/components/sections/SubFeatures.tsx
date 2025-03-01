"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { useMousePosition } from "@/hooks/useMousePosition";
import { fadeInUpVariants } from "@/animations/variation";
import { features } from "@/data";

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
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
      variants={fadeInUpVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      className="group relative"
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
        <p className={cn("text-sm text-zinc-400", montserrat.className)}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section
      className={cn(
        "py-24 overflow-hidden relative",
        montserrat.variable,
        jetbrainsMono.variable
      )}
    >
      <div className="container mx-auto px-4 max-w-6xl z-[1] relative">
        <motion.div
          custom={0}
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <h2
            className={cn(
              "text-4xl font-bold mb-4 tracking-tighter",
              jetbrainsMono.className
            )}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              Elevate Your Business Workflow
            </span>
          </h2>
          <p
            className={cn(
              "text-zinc-400 max-w-2xl mx-auto",
              montserrat.className
            )}
          >
            Easily Build, Scale, and Manage Your Backend with Akashi API.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.name} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import NetworkCanvas from "@/three/NetworkCanvas";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { fadeUpVariants } from "@/animations/variation";

export default function AkashiHero() {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full",
        montserrat.variable,
        jetbrainsMono.variable
      )}
    >
      <div className="absolute inset-0">
        <NetworkCanvas />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.04),transparent_70%)] pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
        <div className="flex flex-col m-auto">
          <div className="relative container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                custom={0}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-emerald-500/20 mb-8"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span
                  className={cn(
                    "text-sm text-emerald-300/80 tracking-wide",
                    jetbrainsMono.className
                  )}
                >
                  Build • Connect • Transform
                </span>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <h1
                  className={cn(
                    "text-5xl sm:text-7xl font-bold mb-6 tracking-tight",
                    montserrat.className
                  )}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
                    Transform Your
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
                    Personal Projects
                  </span>
                </h1>
              </motion.div>

              <motion.div
                custom={2}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-base sm:text-lg text-zinc-400 mb-8 leading-relaxed max-w-2xl mx-auto font-montserrat">
                  Connect and manage your project data dynamically. Update
                  content seamlessly through our intuitive API, without touching
                  your original codebase.
                </p>
              </motion.div>
            </div>
          </div>
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
          >
            <button className=" md:w-auto w-1/2 px-6 py-3 rounded-lg bg-emerald-500 text-zinc-900 font-semibold hover:bg-emerald-400 transition-colors font-montserrat">
              Get Started
            </button>
            <button className="px-6 md:w-auto w-1/2 py-3 rounded-lg bg-zinc-800 text-emerald-300 border border-emerald-500/20 hover:bg-zinc-700 transition-colors font-montserrat">
              View Documentation
            </button>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/90 pointer-events-none" />
    </div>
  );
}

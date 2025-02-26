"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import NetworkCanvas from "@/three/NetworkCanvas";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { fadeUpVariants } from "@/animations/variation";
import Link from "next/link";
import Background from "@/components/ui/Background";
import { Rocket } from "lucide-react";

export default function Custom404() {
  return (
    <div
      className={cn(
        "relative h-screen overflow-hidden w-full",
        montserrat.variable,
        jetbrainsMono.variable
      )}
    >
      <div className="absolute inset-0 z-[1]">
        <NetworkCanvas />
      </div>
      <Background />

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
                  404 • Page Not Found
                </span>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                <h1
                  className={cn(
                    "text-5xl sm:text-7xl font-bold mb-6 tracking-tight",
                    montserrat.className
                  )}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
                    Oops! Looks like you&apos;re
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
                    Lost in Space
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
                  The page you&apos;re looking for doesn&apos;t exist or has
                  been moved. Don&apos;t worry, we&apos;ll help you find your
                  way back to Earth.
                </p>
              </motion.div>
            </div>
          </div>
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center items-center pointer-events-auto"
          >
            <Link
              href="/"
              className="group relative px-8 py-4 rounded-full bg-emerald-500 text-zinc-900 font-semibold hover:bg-emerald-400 transition-colors font-montserrat text-center inline-flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Back to Home</span>
              <Rocket className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

import { AuroraBackground } from "@/components/ui/Aurora-background";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";
import { ArrowUpDown, Plus, Folder } from "lucide-react";

import ModalObject from "@/components/ui/ModalObject";

export default function FormPage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  return (
    <main className="relative overflow-hidden">
      <div className="relative z-[2]">
        <AuroraBackground className="opacity-100">
          <div
            className={cn(
              "min-h-screen w-full text-zinc-100",
              montserrat.variable,
              jetbrainsMono.variable
            )}
          >
            <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
              <motion.div
                className="mb-8 pb-4 border-b border-emerald-500/30"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1
                  className={cn(
                    "text-4xl font-bold mb-2 text-start bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-400",
                    montserrat.className
                  )}
                >
                  Nome
                </motion.h1>
              </motion.div>

              <motion.div
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.h2
                  className={cn(
                    "text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500",
                    montserrat.className
                  )}
                >
                  Objects
                </motion.h2>
                <div className="flex space-x-4">
                  <motion.button
                    className="px-3 py-1 rounded-md bg-zinc-800 text-emerald-300 text-sm font-medium border border-emerald-500/20 hover:bg-zinc-700 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // onClick={handleSort}
                  >
                    <ArrowUpDown className="mr-1" size={14} />
                    Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                  </motion.button>
                  <motion.button
                    className="px-3 py-1 rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // onClick={handleAdd}
                  >
                    <Plus className="mr-1" size={14} />
                    Add
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  key={123}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    // delay: index * 0.05
                  }}
                  className={cn(
                    "aspect-square p-3 rounded-lg bg-zinc-800/50 border border-emerald-500/20 hover:bg-zinc-700/50 transition-colors flex flex-col items-center justify-center cursor-pointer",
                    jetbrainsMono.className
                  )}
                  whileTap={{ scale: 0.95 }}
                  // onClick={() => handleObjectClick(object)}
                >
                  <Folder className="text-emerald-400 mb-2" size={24} />
                  <span className="text-emerald-300/80 text-xs text-center truncate w-full">
                    Objeto
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </AuroraBackground>
      </div>

      <ModalObject isVisible={true}></ModalObject>
    </main>
  );
}

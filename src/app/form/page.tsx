"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/Aurora-background";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";
import { ArrowUpDown, Plus, LogOut, FolderPlus, FileText } from "lucide-react";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const router = useRouter();

  function handleLogout() {
    AuthService.getInstance().logout();
    router.push("/");
  }

  function handleProjectSelect(projectId: string) {
    setSelectedProject(projectId);
  }

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
              {!selectedProject ? (
                <>
                  <motion.div
                    className="mb-8 pb-4 border-b border-emerald-500/30 flex justify-between items-center"
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
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-full text-emerald-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
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
                      >
                        <ArrowUpDown className="mr-1" size={14} />
                        Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                      </motion.button>
                      <motion.button
                        className="px-3 py-1 rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="mr-1" size={14} />
                        Add
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex-grow flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <motion.div
                      className="text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <FolderPlus
                        className="mx-auto text-emerald-400 mb-4"
                        size={48}
                      />
                      <h3
                        className={cn(
                          "text-2xl font-semibold mb-2 text-emerald-300",
                          montserrat.className
                        )}
                      >
                        No Objects Yet
                      </h3>
                      <p
                        className={cn(
                          "text-zinc-400 mb-4",
                          jetbrainsMono.className
                        )}
                      >
                        Start by adding your first object
                      </p>
                      <motion.button
                        className="px-4 py-2 rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="mr-2" size={16} />
                        Add Object
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className="flex-grow flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div
                    className="text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <FileText
                      className="mx-auto text-emerald-400 mb-4"
                      size={48}
                    />
                    <h3
                      className={cn(
                        "text-2xl font-semibold mb-2 text-emerald-300",
                        montserrat.className
                      )}
                    >
                      No Project Selected
                    </h3>
                    <p
                      className={cn(
                        "text-zinc-400 mb-4",
                        jetbrainsMono.className
                      )}
                    >
                      Select an existing project or create a new one
                    </p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        className="px-4 py-2 rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleProjectSelect("new")}
                      >
                        <Plus className="mr-2" size={16} />
                        New Project
                      </motion.button>
                      <motion.button
                        className="px-4 py-2 rounded-md bg-zinc-800 text-emerald-300 text-sm font-medium border border-emerald-500/20 hover:bg-zinc-700 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Select Project
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </AuroraBackground>
      </div>
    </main>
  );
}

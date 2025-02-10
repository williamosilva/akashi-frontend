"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Receipt,
  PieChart,
  Settings,
  Users,
  FileText,
  Search,
  Command,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";

const projects = [
  { id: "1", name: "Dashboard", icon: LayoutDashboard },
  { id: "2", name: "Accounts", icon: Wallet },
  { id: "3", name: "Cards", icon: CreditCard },
  { id: "4", name: "Transaction", icon: Receipt },
  { id: "5", name: "Spend Groups", icon: PieChart },
  { id: "6", name: "Integrations", icon: Settings },
  { id: "7", name: "Payees", icon: Users },
  { id: "8", name: "Invoices", icon: FileText },
];

const Sidebar = ({ className }: any) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    "1"
  );

  return (
    <div className="relative  ">
      <motion.div
        className={cn(
          "flex flex-col h-screen relative overflow-hidden  ",
          className
        )}
        animate={{ width: isExpanded ? "16rem" : "5rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Smoke effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </div>

        {/* Content container */}
        <div className="relative z-10 flex flex-col h-full ">
          {/* Profile section */}
          <div className="p-4 border-b border-emerald-500/20 backdrop-blur-sm">
            <motion.div
              className="flex items-center"
              animate={{ justifyContent: isExpanded ? "flex-start" : "center" }}
            >
              <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-emerald-500/10 text-emerald-400">
                  JD
                </AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="flex flex-col ml-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-sm font-medium text-zinc-100">
                      John Doe
                    </h2>
                    <p className="text-xs text-emerald-400/80">
                      john@example.com
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Search section */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-400/70" />
              <Input
                isExpanded={isExpanded}
                placeholder={isExpanded ? "Search" : ""}
                className={cn(
                  "pl-8",
                  !isExpanded && "w-full px-0 pointer-events-none  border-none"
                )}
              />
              {isExpanded && (
                <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-emerald-500/20 bg-zinc-800/50 backdrop-blur-sm">
                  <Command className="h-4 w-4 text-emerald-400/70" />
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {projects.map((project) => {
              const isSelected = project.id === selectedProjectId;

              return (
                <motion.button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={cn(
                    "relative w-full overflow-hidden group",
                    isSelected && "pointer-events-none rounded-lg"
                  )}
                  whileHover={{ scale: isSelected ? 1 : 1.01 }}
                  whileTap={{ scale: isSelected ? 1 : 0.99 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                >
                  {/* Selected state animation */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Background gradient effect */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r transition-all duration-500 ease-out",
                      isSelected
                        ? "from-emerald-500/10 via-emerald-500/15 to-emerald-500/10"
                        : "from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-emerald-500/10 group-hover:to-emerald-500/5"
                    )}
                  />

                  {/* Glow effect */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      isSelected
                        ? "opacity-100 bg-emerald-500/10 blur-xl"
                        : "opacity-0 group-hover:opacity-100 bg-emerald-500/5 blur-xl"
                    )}
                  />

                  {/* Main content */}
                  <div
                    className={cn(
                      "relative px-4 py-3 rounded-lg border transition-colors duration-300 flex items-center",
                      isSelected
                        ? "border-emerald-500/30"
                        : "border-zinc-800 group-hover:border-emerald-500/20"
                    )}
                  >
                    {/* <project.icon
                      className={cn(
                        isExpanded ? "" : "m-auto",
                        "h-5 w-5 transition-colors duration-300",
                        isSelected
                          ? "text-emerald-300"
                          : "text-zinc-400 group-hover:text-emerald-300"
                      )}
                    /> */}

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          className={cn(
                            "ml-3 text-sm transition-colors duration-300",
                            isSelected
                              ? "text-emerald-300"
                              : "text-zinc-400 group-hover:text-emerald-300"
                          )}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          {project.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Toggle button */}
          <div className="p-4 border-t border-emerald-500/20 backdrop-blur-sm">
            <motion.button
              className="w-full p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-emerald-400/80 flex items-center justify-center gap-2 group transition-all"
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isExpanded ? (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm">Collapse</span>
                </>
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;

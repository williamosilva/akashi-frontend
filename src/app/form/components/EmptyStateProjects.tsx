import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { montserrat } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";

interface EmptyStateProjectsProps {
  setOpenCreateProjectModal: (isOpen: boolean) => void;
  isCreateDisabled: {
    message: string;
    signal: boolean;
  };
}

export default function EmptyStateProjects({
  setOpenCreateProjectModal,
  isCreateDisabled,
}: EmptyStateProjectsProps) {
  return (
    <motion.div
      className="flex-grow flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
        >
          <FileText className="mx-auto h-12 w-12 text-emerald-300" />
        </motion.div>
        <motion.h3
          className={cn(
            "text-sm font-semibold mt-2 text-emerald-300",
            montserrat.className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No Project Selected
        </motion.h3>
        <motion.p
          className="mt-1 text-sm text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Select an existing project or create a new one
        </motion.p>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isCreateDisabled.signal ? (
            <TooltipProvider>
              <Tooltip content={isCreateDisabled.message} position="bottom">
                <motion.button className="inline-flex items-center px-4 bg-zinc-700/50 text-zinc-500 cursor-not-allowed  py-2 border border-transparent text-sm font-medium rounded-md  bg-gradient-to-r  focus:outline-none  shadow-md">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Project
                </motion.button>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <motion.button
              className="inline-flex items-center px-4  py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-400 to-green-600 focus:outline-none  shadow-md"
              onClick={() => setOpenCreateProjectModal(true)}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Project
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

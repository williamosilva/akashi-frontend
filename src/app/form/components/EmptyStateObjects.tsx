import React from "react";
import { motion } from "framer-motion";
import { Box } from "lucide-react";
import { montserrat } from "@/styles/fonts";
import { cn } from "@/lib/utils";

export default function EmptyStateObjects({
  setIsModalOpen,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
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
          <Box className="mx-auto h-12 w-12 text-emerald-300" />
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
          No Objects Created
        </motion.h3>
        <motion.p
          className="mt-1 text-sm text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Get started by creating a new object.
        </motion.p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-400 to-green-600 focus:outline-none shadow-md"
            onClick={() => setIsModalOpen(true)}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Box className="mr-2 h-4 w-4" />
            Create Object
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

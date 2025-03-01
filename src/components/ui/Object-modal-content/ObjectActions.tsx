"use client";

import { Save, Trash, Loader2 } from "lucide-react";
import type { ObjectActionsProps } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ObjectActions({
  onSave,
  onDelete,
  empty,
  isLoading,
  hasId,
}: ObjectActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col md:w-[70%] w-full ml-auto sm:flex-row justify-end items-center gap-4 pt-4 ",
        !empty && "mt-auto"
      )}
    >
      {hasId && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          disabled={isLoading}
          className={cn(
            "w-full flex-1 sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 border border-red-500/20 text-red-400 text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500/10"
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 animate-spin" size={16} />
          ) : (
            <Trash className="mr-2" size={16} />
          )}
          Delete Object
        </motion.button>
      )}

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onSave}
        disabled={isLoading}
        className={cn(
          "px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg",
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:from-emerald-600 hover:to-green-600",
          !hasId ? "w-full flex-0 sm:w-[50%]" : "w-full flex-1 sm:w-auto"
        )}
      >
        {isLoading ? (
          <Loader2 className="mr-2 animate-spin" size={16} />
        ) : (
          <Save className="mr-2" size={16} />
        )}
        Save Changes
      </motion.button>
    </motion.div>
  );
}

import { Tooltip, TooltipProvider } from "@/components/ui/Utils/Tooltip";
import { cn } from "@/lib/utils";
import { montserrat } from "@/styles/fonts";
import { motion } from "framer-motion";
import { PartialProjectData } from "@/types/project.types";
import { Trash } from "lucide-react";

interface HeaderProps {
  projectData: PartialProjectData | null;
  handleDeleteProject: () => void;
}

export default function Header({
  projectData,
  handleDeleteProject,
}: HeaderProps) {
  return (
    <motion.div
      className="mb-8 pb-4 border-b border-emerald-500/30 flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className={cn(
          "md:text-4xl text-xl font-bold mb-2 text-start bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-400 truncate max-w-[90%]",
          montserrat.className
        )}
        title={projectData?.name}
      >
        {projectData?.name}
      </motion.h1>
      <TooltipProvider>
        <Tooltip content="Delete project" position="left">
          <button
            onClick={handleDeleteProject}
            className="p-2 rounded-full text-emerald-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors flex-shrink-0"
            aria-label="Logout"
          >
            <Trash className="h-5 w-5" />
          </button>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}

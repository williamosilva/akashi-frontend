import React from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Plus, Folder } from "lucide-react";

import { PartialProjectData } from "@/types/project.types";
import { montserrat } from "@/styles/fonts";
import { MagicCard } from "@/components/ui/MagicCard";
import { JsonVisualizer } from "@/components/ui/JsonVisualizer/Main";
import QuoteCard from "@/components/ui/QuoteCard";
import { cn } from "@/lib/utils";

// Importe o tipo FormattedProject
import { FormattedProject } from "@/types/project.types"; // Ajuste o caminho de importação conforme necessário

// Atualização dos tipos para resolver os problemas de ESLint e tipagem
interface MainContentProps {
  projectData: PartialProjectData;
  sortOrder: "asc" | "desc" | "none";
  toggleSortOrder: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedObject: (object: {
    key: string;
    data: Record<string, unknown>;
  }) => void;
  dataJson: FormattedProject | null; // Permitindo null como valor válido
  apiUrl: string | null;
}

export default function MainContent({
  projectData,
  sortOrder,
  toggleSortOrder,
  setIsModalOpen,
  setSelectedObject,
  dataJson,
  apiUrl,
}: MainContentProps) {
  return (
    <>
      <motion.div
        className="flex justify-between items-start md:gap-0 gap-2 md:items-center mb-6 md:flex-row flex-col"
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
          Your objects
        </motion.h2>
        <div className="flex space-x-2 md:w-auto w-full">
          <motion.button
            className="px-3 md:py-1 py-3 rounded-3xl md:w-auto w-full bg-zinc-800 text-emerald-300 text-sm font-medium border border-emerald-500/20 hover:bg-zinc-700 transition-colors flex items-center"
            whileTap={{ scale: 0.95 }}
            onClick={toggleSortOrder}
          >
            <ArrowUpDown
              className={cn(
                "mr-1 transform transition-transform",
                sortOrder === "asc" && "rotate-180"
              )}
              size={14}
            />
            Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </motion.button>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-medium w-full md:w-auto hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="mr-2" size={16} />
            Add
          </motion.button>
        </div>
      </motion.div>
      <div className="overflow-y-auto h-full flex-col justify-between flex gap-4">
        <motion.div
          className="flex-1 overflow-y-auto min-h-0 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid xl:grid-cols-10 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 grid-cols-3 gap-4">
              {(() => {
                let entries = Object.entries(projectData.dataInfo ?? {});

                if (sortOrder !== "none") {
                  entries = entries.sort(([, valueA], [, valueB]) => {
                    const nameA = (
                      valueA as { akashiObjectName: string }
                    ).akashiObjectName.toLowerCase();
                    const nameB = (
                      valueB as { akashiObjectName: string }
                    ).akashiObjectName.toLowerCase();

                    return sortOrder === "asc"
                      ? nameA.localeCompare(nameB)
                      : nameB.localeCompare(nameA);
                  });
                }

                return entries.map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.2,
                    }}
                    onClick={() => {
                      const objectWithIdAsKey = {
                        [key]: value,
                      };
                      setSelectedObject({
                        key,
                        data: objectWithIdAsKey,
                      });
                    }}
                  >
                    <MagicCard
                      gradientColor={"#1d2b2a"}
                      gradientOpacity={0.8}
                      gradientSize={100}
                      className="w-full flex justify-center items-center aspect-square rounded-lg border border-emerald-500/20 hover:border-emerald-500/60 transition-all cursor-pointer group overflow-hidden"
                    >
                      <div className="h-full w-full p-2 flex flex-col items-center justify-center">
                        <motion.div
                          className="text-emerald-400 mb-2"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <Folder size={24} />
                        </motion.div>
                        <h3 className="text-emerald-300 font-medium text-center text-xs group-hover:text-emerald-200 transition-colors line-clamp-2 select-none">
                          {
                            (value as { akashiObjectName: string })
                              .akashiObjectName
                          }
                        </h3>
                      </div>
                    </MagicCard>
                  </motion.div>
                ));
              })()}
            </div>
          </motion.div>
        </motion.div>

        <div className="flex lg:h-[40%] h-[60%] w-full gap-4 lg:flex-row flex-col shrink-0 items-end min-h-0 min-w-0">
          <div className="lg:flex-[0_0_calc(65%-0.5rem)] lg:h-full h-full w-full min-h-0 min-w-0">
            <JsonVisualizer data={dataJson} apiUrl={apiUrl} />
          </div>
          <div className="lg:flex-[0_0_calc(35%-0.5rem)] lg:h-[88%] h-full w-full min-h-0 min-w-0">
            <QuoteCard link={apiUrl} />
          </div>
        </div>
      </div>
    </>
  );
}

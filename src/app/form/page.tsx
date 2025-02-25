"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/Aurora-background";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";
import {
  ArrowUpDown,
  Plus,
  LogOut,
  FolderPlus,
  FileText,
  Trash,
  Folder,
} from "lucide-react";
import { JsonVisualizer } from "@/components/ui/JsonVisualizer/Main";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/ui/ConditionalLayout";
import { ProjectService } from "@/services/project.service";
import { Project, PartialProjectData } from "@/types/project.types";
import ModalObject from "@/components/ui/ModalObject";
// import JsonVisualizer from "@/components/ui/JsonVisualizer";
import QuoteCard from "@/components/ui/QuoteCard";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import LoadingComponent from "@/components/ui/LoadingComponent";

export default function FormPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<PartialProjectData | null>(
    null
  );
  const [dataJson, setDataJson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const router = useRouter();
  const { selectedProjectId, triggerReload, setSelectedProjectId } =
    useProject();

  const [sortOrder, setSortOrder] = useState("none");

  // Função para alternar a ordem
  const toggleSortOrder = () => {
    if (sortOrder === "none" || sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      // quando está em "asc"
      setSortOrder("desc");
    }
  };
  // Estado para controle do modal
  const [selectedObject, setSelectedObject] = useState<{
    key: string;
    data: any;
  } | null>(null);

  // Fetch project data whenever selectedProjectId changes
  useEffect(() => {
    async function fetchProjectData() {
      if (!selectedProjectId) {
        setProjectData(null);
        setDataJson(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const projectService = ProjectService.getInstance();

        // Primeira requisição - obter informações detalhadas do projeto
        const project = await projectService.getProjectDataInfo(
          selectedProjectId
        );
        setProjectData(project);

        // Segunda requisição - obter projeto formatado em JSON
        const jsonProject = await projectService.getFormattedProject(
          selectedProjectId
        );
        setDataJson(jsonProject);
        setApiUrl(
          `https://akashi-backend.onrender.com/projects/${selectedProjectId}/formatted`
        );
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Failed to load project data. Please try again.");
        setProjectData(null);
        setDataJson(null);
        setApiUrl(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectData();
  }, [selectedProjectId]);

  function handleDeleteProject() {
    ProjectService.getInstance()
      .deleteProject(selectedProjectId)
      .then(() => {
        setSelectedProject(null);
        triggerReload();
        setSelectedProjectId(null);
      })
      .catch((err) => {
        console.error("Error deleting project:", err);
        setError("Failed to delete project");
      });
  }
  const handleRefreshData = async () => {
    if (selectedProjectId) {
      try {
        setIsLoading(true);
        console.log("bateu aquiii");
        const projectService = ProjectService.getInstance();
        const project = await projectService.getProjectDataInfo(
          selectedProjectId
        );

        setProjectData(project);
        const jsonProject = await projectService.getFormattedProject(
          selectedProjectId
        );
        setDataJson(jsonProject);
        setApiUrl(
          `https://akashi-backend.onrender.com/projects/${selectedProjectId}/formatted`
        );
      } catch (err) {
        console.error("Error refreshing data:", err);
        setError("Failed to refresh data");
      } finally {
        setIsLoading(false);
        setSortOrder("none");
      }
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="relative z-[2]">
        <AuroraBackground className="opacity-100">
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <div
              className={cn(
                "min-h-screen w-full text-zinc-100",
                montserrat.variable,
                jetbrainsMono.variable
              )}
            >
              <div className="container mx-auto px-4 pb-8 md:pt-8 pt-20  flex flex-col h-screen  ">
                {selectedProjectId ? (
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
                        {projectData?.name}
                      </motion.h1>
                      <TooltipProvider>
                        <Tooltip content="Delete project" position="left">
                          <button
                            onClick={handleDeleteProject}
                            className="p-2 rounded-full text-emerald-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                            aria-label="Logout"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>

                    {error && (
                      <motion.div
                        className="bg-red-500/20 border border-red-500/30 rounded-md p-3 mb-6 text-red-200"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className={cn("text-sm", jetbrainsMono.className)}>
                          {error}
                        </p>
                      </motion.div>
                    )}

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
                        Objects
                      </motion.h2>
                      <div className="flex space-x-4 md:w-auto w-full">
                        <motion.button
                          className="px-3 md:py-1 py-3 rounded-md md:w-auto w-full bg-zinc-800 text-emerald-300 text-sm font-medium border border-emerald-500/20 hover:bg-zinc-700 transition-colors flex items-center"
                          whileHover={{ scale: 1.05 }}
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
                          className="px-3 md:py-1 py-3  rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium md:w-auto w-full hover:bg-emerald-400 transition-colors flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="mr-1" size={14} />
                          Add
                        </motion.button>
                      </div>
                    </motion.div>
                    <div className="overflow-y-auto h-full flex-col justify-between flex gap-4">
                      {/* Primeira div com altura dinâmica e scroll quando necessário */}
                      <motion.div
                        className="flex-1 overflow-y-auto min-h-0 w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        {/* Resto do conteúdo permanece o mesmo */}
                        {isLoading ? (
                          <motion.div
                            className="text-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          >
                            <div className="w-12 h-12 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p
                              className={cn(
                                "text-zinc-400",
                                jetbrainsMono.className
                              )}
                            >
                              Loading project data...
                            </p>
                          </motion.div>
                        ) : projectData?.dataInfo &&
                          Object.keys(projectData.dataInfo).length > 0 ? (
                          <motion.div
                            className="w-full"
                            initial={{ opacity: 0, y: -200 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-4">
                              {(() => {
                                let entries = Object.entries(
                                  projectData.dataInfo
                                );

                                if (sortOrder !== "none") {
                                  entries = entries.sort(
                                    ([keyA, valueA], [keyB, valueB]) => {
                                      const nameA =
                                        valueA.akashiObjectName.toLowerCase();
                                      const nameB =
                                        valueB.akashiObjectName.toLowerCase();

                                      return sortOrder === "asc"
                                        ? nameA.localeCompare(nameB)
                                        : nameB.localeCompare(nameA);
                                    }
                                  );
                                }

                                return entries.map(([key, value], index) => (
                                  <motion.div
                                    key={key}
                                    className="w-full aspect-square bg-zinc-800/50 rounded-lg border border-emerald-500/20 hover:border-emerald-500/60 transition-all cursor-pointer hover:bg-zinc-700/50 group overflow-hidden"
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
                                      <h3 className="text-emerald-300 font-medium text-center text-xs group-hover:text-emerald-200 transition-colors line-clamp-2">
                                        {value.akashiObjectName}
                                      </h3>
                                    </div>
                                  </motion.div>
                                ));
                              })()}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="text-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                          >
                            {/* ... Conteúdo de estado vazio ... */}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Segunda div com altura fixa */}
                      <div className="flex lg:h-[30%] h-[50%] w-full gap-4 lg:flex-row flex-col shrink-0">
                        <JsonVisualizer data={dataJson} apiUrl={apiUrl} />

                        <QuoteCard
                          link={`https://akashi-backend.onrender.com/projects/${selectedProjectId}/formatted`}
                        />
                      </div>
                    </div>
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
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </AuroraBackground>
      </div>

      {/* Modal para adicionar/editar objetos */}
      <ModalObject
        isVisible={isModalOpen || !!selectedObject}
        projectId={selectedProjectId || ""}
        itemKey={selectedObject?.key || "newObject"}
        initialData={selectedObject?.data}
        onClose={(refresh: boolean) => {
          setIsModalOpen(false);
          setSelectedObject(null);

          if (refresh) handleRefreshData();
        }}
      />
    </main>
  );
}

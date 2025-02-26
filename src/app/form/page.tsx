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
  Box,
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
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/MagicCard";

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
  // const router = useRouter();
  const {
    selectedProjectId,
    triggerReload,
    setSelectedProjectId,
    openCreateProjectModal,
    setOpenCreateProjectModal,
  } = useProject();

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
            <>
              {selectedProjectId ? (
                <div
                  className={cn(
                    "min-h-screen w-full text-zinc-100",
                    montserrat.variable,
                    jetbrainsMono.variable
                  )}
                >
                  <div className="container mx-auto px-4 pb-8 md:pt-8 pt-20 h-full flex flex-col lg:h-screen  ">
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
                        title={projectData?.name} // Mostra o nome completo ao passar o mouse
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

                    {projectData?.dataInfo &&
                    Object.keys(projectData.dataInfo).length > 0 ? (
                      <>
                        {" "}
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
                              // whileHover={{ scale: 1.05 }}
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
                              // whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus className="mr-2" size={16} />
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
                            <motion.div
                              className="w-full"
                              initial={{ opacity: 0, y: -200 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <div className="grid xl:grid-cols-10 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 grid-cols-3 gap-4">
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
                                        className="w-full flex  justify-center items-center aspect-square rounded-lg border border-emerald-500/20 hover:border-emerald-500/60 transition-all cursor-pointer group overflow-hidden"
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
                                            {value.akashiObjectName}
                                          </h3>
                                        </div>
                                      </MagicCard>
                                    </motion.div>
                                  ));
                                })()}
                              </div>
                            </motion.div>
                          </motion.div>

                          {/* Segunda div com altura fixa */}
                          {/* <div className="flex lg:h-[40%] h-[60%] w-full gap-4 lg:flex-row flex-col shrink-0 items-end">
                        <JsonVisualizer data={dataJson} apiUrl={apiUrl} />

                        <QuoteCard
                          link={`https://akashi-backend.onrender.com/projects/${selectedProjectId}/formatted`}
                        />
                      </div> */}
                          <div className="flex lg:h-[40%] h-[60%] w-full gap-4 lg:flex-row flex-col shrink-0 items-end min-h-0 min-w-0">
                            {/* Filho 1 - 80% - metade do gap (0.5rem = 8px) */}
                            <div className="lg:flex-[0_0_calc(65%-0.5rem)] lg:h-full h-full w-full min-h-0 min-w-0">
                              <JsonVisualizer data={dataJson} apiUrl={apiUrl} />
                            </div>

                            {/* Filho 2 - 20% - metade do gap */}
                            <div className="lg:flex-[0_0_calc(35%-0.5rem)] lg:h-[88%] h-full w-full min-h-0 min-w-0">
                              <QuoteCard link={apiUrl} />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full ">
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
                              className="inline-flex items-center px-4  py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-400 to-green-600 focus:outline-none  shadow-md"
                              onClick={() => setIsModalOpen(true)}
                              whileHover={{
                                scale: 1.05,
                                // boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Box className="mr-2 h-4 w-4" />
                              Create Object
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
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
                      <motion.button
                        className="inline-flex items-center px-4  py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-400 to-green-600 focus:outline-none  shadow-md"
                        onClick={() => setOpenCreateProjectModal(true)}
                        whileHover={{
                          scale: 1.05,
                          // boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Project
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </>
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

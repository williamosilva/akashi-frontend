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
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import EmptyStateObjects from "./components/EmptyStateObjects";
import EmptyStateProjects from "./components/EmptyStateProjects";

export default function FormPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<PartialProjectData | null>(
    null
  );

  const [dataJson, setDataJson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>("");

  // const router = useRouter();
  const {
    selectedProjectId,
    triggerReload,
    setSelectedProjectId,
    openCreateProjectModal,
    setOpenCreateProjectModal,
  } = useProject();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

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
                    <Header
                      projectData={projectData}
                      handleDeleteProject={handleDeleteProject}
                    />

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
                      <MainContent
                        projectData={projectData}
                        sortOrder={sortOrder}
                        toggleSortOrder={toggleSortOrder}
                        setIsModalOpen={setIsModalOpen}
                        setSelectedObject={setSelectedObject}
                        dataJson={dataJson}
                        apiUrl={apiUrl}
                      />
                    ) : (
                      <EmptyStateObjects setIsModalOpen={setIsModalOpen} />
                    )}
                  </div>
                </div>
              ) : (
                <EmptyStateProjects
                  setOpenCreateProjectModal={setOpenCreateProjectModal}
                />
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

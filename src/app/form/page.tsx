"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/Aurora-background";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";
import { useProject } from "@/components/ui/ConditionalLayout";
import { ProjectService } from "@/services/project.service";
import { PartialProjectData, FormattedProject } from "@/types/project.types";
import ModalObject from "@/components/ui/ModalObject";
import LoadingComponent from "@/components/ui/LoadingComponent";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import EmptyStateObjects from "./components/EmptyStateObjects";
import EmptyStateProjects from "./components/EmptyStateProjects";

export default function FormPage() {
  const [, setSelectedProject] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<PartialProjectData | null>(
    null
  );
  const [dataJson, setDataJson] = useState<FormattedProject | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState<string | null>("");

  const {
    selectedProjectId,
    triggerReload,
    setSelectedProjectId,
    setOpenCreateProjectModal,
  } = useProject();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  const toggleSortOrder = () => {
    if (sortOrder === "none" || sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
  };

  const [selectedObject, setSelectedObject] = useState<{
    key: string;
    data: any;
  } | null>(null);

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
    if (selectedProjectId) {
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
    } else {
      console.error("No project selected.");
      setError("No project selected.");
    }
  }

  const handleRefreshData = async () => {
    if (selectedProjectId) {
      try {
        setIsLoading(true);
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

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
  Folder,
} from "lucide-react";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/ui/ConditionalLayout";
import { ProjectService } from "@/services/project.service";
import { Project, PartialProjectData } from "@/types/project.types";
import ModalObject from "@/components/ui/ModalObject";
import JsonVisualizer from "@/components/ui/JsonVisualizer";
import QuoteCard from "@/components/ui/QuoteCard";

const mockData = {
  user: {
    id: 12345,
    name: "John Doe",
    email:
      "johndoe@example.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcom",
    isActive: true,
    profile: {
      age: 30,
      location: {
        city: "São Paulo",
        country: "Brasil",
      },
      preferences: ["dark mode", "notifications", "beta features"],
    },
  },
  products: [
    {
      id: 1,
      name: "Laptop Gamer",
      price: 7599.99,
      stock: 12,
    },
    {
      id: 2,
      name: "Monitor UltraWide",
      price: 1899.99,
      stock: 5,
    },
  ],
  settings: {
    theme: "dark",
    language: "pt-BR",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
};

export default function FormPage() {
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<PartialProjectData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { selectedProjectId } = useProject();

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
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Failed to load project data. Please try again.");
        setProjectData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectData();
  }, [selectedProjectId]);

  console.log("teste", projectData);

  function handleLogout() {
    AuthService.getInstance().logout();
    router.push("/");
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
      } catch (err) {
        console.error("Error refreshing data:", err);
        setError("Failed to refresh data");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="relative z-[2]">
        <AuroraBackground className="opacity-100">
          <div
            className={cn(
              "min-h-screen w-full text-zinc-100",
              montserrat.variable,
              jetbrainsMono.variable
            )}
          >
            <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
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
                      {isLoading
                        ? "Loading..."
                        : projectData?.name || "Project"}
                    </motion.h1>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-full text-emerald-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
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
                    className="flex justify-between items-center mb-6"
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
                    <div className="flex space-x-4">
                      <motion.button
                        className="px-3 py-1 rounded-md bg-zinc-800 text-emerald-300 text-sm font-medium border border-emerald-500/20 hover:bg-zinc-700 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowUpDown className="mr-1" size={14} />
                        Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                      </motion.button>
                      <motion.button
                        onClick={() => setIsModalOpen(true)}
                        className="px-3 py-1 rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="mr-1" size={14} />
                        Add
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    className=" flex items-start justify-start h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
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
                        className="w-full h-full flex-1"
                        initial={{ opacity: 0, y: -200 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="grid grid-cols-8 gap-4">
                          {Object.entries(projectData.dataInfo).map(
                            ([key, value], index) => (
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
                            )
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <FolderPlus
                          className="mx-auto text-emerald-400 mb-4"
                          size={48}
                        />
                        <h3
                          className={cn(
                            "text-2xl font-semibold mb-2 text-emerald-300",
                            montserrat.className
                          )}
                        >
                          No Objects Yet
                        </h3>
                        <p
                          className={cn(
                            "text-zinc-400 mb-4",
                            jetbrainsMono.className
                          )}
                        >
                          Start by adding your first object
                        </p>
                        <motion.button
                          onClick={() => setIsModalOpen(true)}
                          className="px-4 py-2 rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center mx-auto"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="mr-2" size={16} />
                          Add Object
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
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
              {selectedProjectId && (
                <div className="flex lg:h-[30%] h-[50%] w-full gap-4 lg:flex-row flex-col">
                  <JsonVisualizer data={mockData} />
                  <QuoteCard />
                </div>
              )}
            </div>
          </div>
        </AuroraBackground>
      </div>

      {/* Modal para adicionar/editar objetos */}
      <ModalObject
        isVisible={isModalOpen || !!selectedObject}
        projectId={selectedProjectId || ""}
        itemKey={selectedObject?.key || "newObject"}
        initialData={selectedObject?.data}
        onClose={(refresh) => {
          setIsModalOpen(false);
          setSelectedObject(null);
          if (refresh) handleRefreshData();
        }}
      />
    </main>
  );
}

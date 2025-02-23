"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search,
  Command,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectService } from "@/services/project.service";
import { Project, CreateProjectDto } from "@/types/project.types";
import { Tooltip, TooltipProvider } from "./Tooltip";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/ui/ConditionalLayout";

const Sidebar = ({
  className,
  isCreateDisabled = false,
  selectedProjectId: propSelectedProjectId,
  onProjectSelect,
  signal,
}: {
  className?: string;
  isCreateDisabled?: boolean;
  selectedProjectId?: string | null;
  onProjectSelect?: (projectId: string) => void;
  signal?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    propSelectedProjectId || null
  );
  // const { userId, photo, fullName, email } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const {
    userId,
    setUserId,
    email,
    setEmail,
    fullName,
    setFullName,
    photo,
    setPhoto,
  } = useUser();

  useEffect(() => {
    if (propSelectedProjectId) {
      setSelectedProjectId(propSelectedProjectId);
    }
  }, [propSelectedProjectId]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (onProjectSelect) {
      onProjectSelect(projectId);
    }
  };

  useEffect(() => {
    console.log("Atualizando lista de projetos...");
    // setSelectedProjectId(null);
    const loadProjects = async () => {
      try {
        console.log("primeiro teste", userId);
        if (!userId) return console.error("User ID not found");

        const projects = await ProjectService.getInstance().getProjectsByUser(
          userId
        );

        setProjects(projects);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
      }
    };

    loadProjects();
  }, [signal]);

  const handleCreateProject = async (projectName: string) => {
    try {
      const newProject = await ProjectService.getInstance().createProject({
        name: projectName,
        userId: userId || "",
        dataInfo: {},
      } as CreateProjectDto);

      setProjects((prevProjects) => [...prevProjects, newProject]);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function handleLogout() {
    AuthService.getInstance().logout();
    setUserId(null);
    setEmail(null);
    setFullName(null);
    setPhoto(null);
    router.push("/");
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          {/* Animated Toggle Button that moves from left to right */}
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.button
                key="close-button"
                className="fixed top-4 right-4 z-50 p-2 bg-zinc-800 rounded-md shadow-md"
                onClick={toggleMobileMenu}
                initial={{ x: -20, opacity: 0, left: "1rem", right: "auto" }}
                animate={{ x: 0, opacity: 1, left: "auto", right: "1rem" }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <X className="h-6 w-6 text-emerald-400" />
              </motion.button>
            ) : (
              <motion.button
                key="open-button"
                className="fixed top-4 left-4 z-50 p-2 bg-zinc-800 rounded-md shadow-md"
                onClick={toggleMobileMenu}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Menu className="h-6 w-6 text-emerald-400" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-40 w-4/5 max-w-sm bg-zinc-900 shadow-lg"
              >
                <motion.div
                  className={cn(
                    "flex flex-col h-full relative overflow-hidden",
                    className
                  )}
                  animate={{
                    width: isExpanded || isMobile ? "100%" : "5rem",
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent" />
                    <div className="absolute inset-0 backdrop-blur-[1px]" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="p-4 border-b border-emerald-500/20 backdrop-blur-sm">
                      <motion.div
                        className="flex items-center"
                        animate={{
                          justifyContent:
                            isExpanded || isMobile ? "flex-start" : "center",
                        }}
                      >
                        <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-emerald-500/10 text-emerald-400">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <AnimatePresence>
                          {(isExpanded || isMobile) && (
                            <motion.div
                              className="flex flex-col ml-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                            >
                              <h2 className="text-sm font-medium text-zinc-100">
                                John Doe
                              </h2>
                              <p className="text-xs text-emerald-400/80">
                                john@example.com
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>{" "}
                        <TooltipProvider>
                          <Tooltip
                            content="Logout"
                            position="right"
                            className="ml-auto"
                          >
                            <button
                              onClick={handleLogout}
                              className="p-2  rounded-full text-emerald-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                              aria-label="Logout"
                            >
                              <LogOut className="h-4 w-4 " />
                            </button>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    </div>
                    <div className="p-4">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-400/70" />
                        <Input
                          ref={inputRef}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          isExpanded={isExpanded || isMobile}
                          placeholder={
                            isExpanded || isMobile ? "Search projects..." : ""
                          }
                          className={cn(
                            "pl-8",
                            !(isExpanded || isMobile) &&
                              "w-full px-0 pointer-events-none border-none"
                          )}
                          // Adicione estas props
                          onBlur={(e) => {
                            // Previne a perda de foco
                            e.preventDefault();
                            inputRef.current?.focus();
                          }}
                          autoComplete="off" // Previne autocompletion que pode causar rerenders
                        />
                        {(isExpanded || isMobile) && (
                          <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-emerald-500/20 bg-zinc-800/50 backdrop-blur-sm">
                            <Command className="h-4 w-4 text-emerald-400/70" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-2 space-y-1.5 w-full flex-col flex">
                      {/* Create Object Button */}
                      <motion.button
                        layout
                        layoutId="create-button"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 group transition-all",
                          isCreateDisabled
                            ? "bg-zinc-700/50 text-zinc-500 cursor-not-allowed"
                            : "bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-300"
                        )}
                        onClick={
                          isCreateDisabled
                            ? undefined
                            : () => setIsCreateModalOpen(true)
                        }
                        whileTap={
                          isCreateDisabled ? undefined : { scale: 0.98 }
                        }
                        disabled={isCreateDisabled}
                      >
                        <Plus
                          className={cn(
                            "h-5 w-5",
                            isCreateDisabled
                              ? "text-zinc-500"
                              : "text-emerald-300"
                          )}
                        />
                        {/* Remova o AnimatePresence aqui */}
                        {(isExpanded || isMobile) && (
                          <span className="text-sm">Create Project</span>
                        )}
                      </motion.button>
                      {filteredProjects.map((project) => {
                        const isSelected = project._id === selectedProjectId;

                        return (
                          <motion.button
                            layout // Adicione esta prop
                            layoutId={`project-${project._id}`} // Adicione esta prop
                            key={project._id}
                            onClick={() => handleProjectSelect(project._id)}
                            className={cn(
                              "relative w-full overflow-hidden group",
                              isSelected && "pointer-events-none rounded-lg"
                            )}
                            whileHover={{ scale: isSelected ? 1 : 1.01 }}
                            whileTap={{ scale: isSelected ? 1 : 0.99 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                              layout: { duration: 0.2 }, // Adicione esta config
                            }}
                          >
                            {/* Remova o AnimatePresence aqui */}
                            {isSelected && (
                              <motion.div
                                layoutId={`bg-${project._id}`} // Adicione esta prop
                                className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm"
                              />
                            )}

                            {/* Resto do código permanece igual */}

                            <div
                              className={cn(
                                "relative px-4 py-3 rounded-lg border transition-colors duration-300 flex items-center max-w-full",
                                isSelected
                                  ? "border-emerald-500/30"
                                  : "border-zinc-800 group-hover:border-emerald-500/20"
                              )}
                            >
                              {/* Remova o AnimatePresence aqui também */}
                              {(isExpanded || isMobile) && (
                                <span // Transforme em span normal em vez de motion.span
                                  className={cn(
                                    "truncate text-sm transition-colors duration-300",
                                    isSelected
                                      ? "text-emerald-300"
                                      : "text-zinc-400 group-hover:text-emerald-300"
                                  )}
                                >
                                  {project.name}
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </nav>

                    {/* Toggle button */}
                    {!isMobile && (
                      <div className="p-4 border-t border-emerald-500/20 backdrop-blur-sm">
                        <motion.button
                          className="w-full p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-emerald-400/80 flex items-center justify-center gap-2 group transition-all"
                          onClick={() => setIsExpanded(!isExpanded)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronLeft className="h-4 w-4" />
                              <span className="text-sm">Collapse</span>
                            </>
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50"
              onClick={toggleMobileMenu}
            />
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            className={cn(
              "flex flex-col h-full relative overflow-hidden ",
              className
            )}
            animate={{
              width: isExpanded || isMobile ? "19rem" : "5rem",
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent" />
              <div className="absolute inset-0 backdrop-blur-[1px]" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="p-4 border-b border-emerald-500/20 backdrop-blur-sm">
                <motion.div
                  className="flex items-center"
                  animate={{
                    justifyContent:
                      isExpanded || isMobile ? "flex-start" : "center",
                  }}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
                    <AvatarImage src="/placeholder.svg" />
                    {photo ? (
                      <AvatarImage src={photo} />
                    ) : (
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-400">
                        {fullName &&
                          fullName
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <AnimatePresence>
                    {(isExpanded || isMobile) && (
                      <motion.div
                        className="flex flex-col ml-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-sm font-medium text-zinc-100">
                          {fullName}
                        </h2>
                        <p className="text-[0.6vw] text-emerald-400/80">
                          {email}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>{" "}
                  {isExpanded && (
                    <TooltipProvider>
                      <Tooltip
                        content="Logout"
                        position="right"
                        className="ml-auto"
                      >
                        <button
                          onClick={handleLogout}
                          className="p-2  rounded-full text-emerald-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                          aria-label="Logout"
                        >
                          <LogOut className="h-4 w-4 " />
                        </button>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </motion.div>
              </div>
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-400/70" />
                  <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    isExpanded={isExpanded || isMobile}
                    placeholder={
                      isExpanded || isMobile ? "Search projects..." : ""
                    }
                    className={cn(
                      "pl-8",
                      !(isExpanded || isMobile) &&
                        "w-full px-0 pointer-events-none border-none"
                    )}
                  />
                  {(isExpanded || isMobile) && (
                    <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-emerald-500/20 bg-zinc-800/50 backdrop-blur-sm">
                      <Command className="h-4 w-4 text-emerald-400/70" />
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-2 space-y-1.5 w-full flex-col flex max-w-full">
                {/* Create Object Button */}
                <motion.button
                  layout
                  layoutId="create-button"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 group transition-all",
                    isCreateDisabled
                      ? "bg-zinc-700/50 text-zinc-500 cursor-not-allowed"
                      : "bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-300"
                  )}
                  onClick={
                    isCreateDisabled
                      ? undefined
                      : () => setIsCreateModalOpen(true)
                  }
                  whileTap={isCreateDisabled ? undefined : { scale: 0.98 }}
                  disabled={isCreateDisabled}
                >
                  <Plus
                    className={cn(
                      "h-5 w-5",
                      isCreateDisabled ? "text-zinc-500" : "text-emerald-300"
                    )}
                  />
                  {/* Remova o AnimatePresence aqui */}
                  {(isExpanded || isMobile) && (
                    <span className="text-sm">Create Project</span>
                  )}
                </motion.button>
                {filteredProjects.map((project) => {
                  const isSelected = project._id === selectedProjectId;

                  return (
                    <motion.button
                      layout // Adicione esta prop
                      layoutId={`project-${project._id}`} // Adicione esta prop
                      key={project._id}
                      onClick={() => handleProjectSelect(project._id)}
                      className={cn(
                        "relative w-full overflow-hidden group",
                        isSelected && "pointer-events-none rounded-lg"
                      )}
                      whileHover={{ scale: isSelected ? 1 : 1.01 }}
                      whileTap={{ scale: isSelected ? 1 : 0.99 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        layout: { duration: 0.2 }, // Adicione esta config
                      }}
                    >
                      {/* Remova o AnimatePresence aqui */}
                      {isSelected && (
                        <motion.div
                          layoutId={`bg-${project._id}`} // Adicione esta prop
                          className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm"
                        />
                      )}

                      {/* Resto do código permanece igual */}

                      <div
                        className={cn(
                          "relative px-4 py-3 rounded-lg border transition-colors duration-300 flex items-center w-full ",
                          isSelected
                            ? "border-emerald-500/30"
                            : "border-zinc-800 group-hover:border-emerald-500/20"
                        )}
                      >
                        {/* Remova o AnimatePresence aqui também */}
                        {isExpanded || isMobile ? (
                          <span
                            className={cn(
                              " text-sm transition-colors duration-300 truncate",
                              isSelected
                                ? "text-emerald-300"
                                : "text-zinc-400 group-hover:text-emerald-300"
                            )}
                          >
                            {project.name}
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "mx-auto text-sm transition-colors duration-300",
                              isSelected
                                ? "text-emerald-300"
                                : "text-zinc-400 group-hover:text-emerald-300"
                            )}
                          >
                            {project.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Toggle button */}
              {!isMobile && (
                <div className="p-4 border-t border-emerald-500/20 backdrop-blur-sm">
                  <motion.button
                    className="w-full p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-emerald-400/80 flex items-center justify-center gap-2 group transition-all"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-sm">Collapse</span>
                      </>
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </>
  );
};

export default Sidebar;

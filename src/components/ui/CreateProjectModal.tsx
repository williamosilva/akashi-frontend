"use client";

import type React from "react";
import { useState } from "react";
import { Modal } from "./Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useUser } from "./ConditionalLayout";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectName: string) => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("caiu aqui");
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      setIsLoading(true);
      setError("");

      onCreateProject(projectName.trim());
      setProjectName("");
      onClose();
    } catch (err) {
      let errorMessage = "Failed to create project";
      if (err instanceof Error) {
        errorMessage = err.message;
        // Mensagem mais amigável para erro de userId
        if (err.message === "User ID not found in storage") {
          errorMessage = "Please login to create a project";
        }
      }
      setError(errorMessage);
      console.error("Error creating project:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full  mx-auto px-4 sm:px-0 lg:px-0"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-emerald-400 text-start">
          Create New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            {/* <label
              htmlFor="projectName"
              className="block text-sm font-medium text-emerald-300 mb-2"
            >
              Project Name
            </label> */}
            <Input
              id="projectName"
              type="text"
              placeholder="Enter project name"
              showSearchIcon={false}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isLoading}
              className="w-full py-2 sm:py-3 bg-zinc-800/50 border-emerald-500/30 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 text-zinc-100 placeholder-zinc-500 text-sm sm:text-base"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 border-zinc-600 hover:border-zinc-500 text-sm sm:text-base py-2 sm:py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base py-2 sm:py-3"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
}

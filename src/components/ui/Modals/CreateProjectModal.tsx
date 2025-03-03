"use client";

import type React from "react";
import { useState } from "react";
import { Modal } from "./Modal";
import { Input } from "@/components/ui/Utils/Input";
import { motion } from "framer-motion";

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

  const maxLength = 30;

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setProjectName(value);
    }
  };

  const isOverLimit = projectName.length > maxLength;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="md:w-96 w-full mx-auto px-4 sm:px-0 lg:px-0"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-emerald-400 text-start">
          Create New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <div className="relative">
              <Input
                id="projectName"
                type="text"
                placeholder="Enter project name"
                showSearchIcon={false}
                value={projectName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full py-2 sm:py-3 bg-zinc-800/50 border-emerald-500/30 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 text-zinc-100 placeholder-zinc-500 text-sm sm:text-base pr-16"
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm ${
                  isOverLimit ? "text-red-500" : "text-zinc-400"
                }`}
              >
                {projectName.length}/{maxLength}
              </span>
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              disabled={isLoading}
              className="w-full flex-1 sm:w-auto px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-500/40 text-zinc-300 text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              Cancel
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || isOverLimit}
              type="submit"
              className={`px-4 py-2 flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg ${
                isOverLimit ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Create Project
            </motion.button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
}

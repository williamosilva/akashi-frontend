"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jetbrainsMono } from "@/styles/fonts";
import { JsonVisualizerContent } from "./JsonVisualizerContent";
import { TypeVisualizerContent } from "./TypeVisualizerContent";
import UsageVisualizerContent from "./UsageVisualizerContent";
import { Tabs } from "@/components/ui/vercel-tabs";

export type ViewType = "json" | "types" | "usage";

interface JsonVisualizerProps {
  data: unknown;
  initialView?: ViewType;
  apiUrl: string | null;
}

export const JsonVisualizer: React.FC<JsonVisualizerProps> = ({
  data,
  initialView = "json",
  apiUrl,
}) => {
  const [activeView, setActiveView] = useState<ViewType>(initialView);

  const tabs = [
    { id: "json", label: "Json visualizer" },
    { id: "types", label: "Types" },
    { id: "usage", label: "How to use" },
  ];

  const springAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs
        tabs={tabs}
        activeTab={activeView}
        onTabChange={(tabId) => setActiveView(tabId as ViewType)}
        className="mb-[5px] ml-2"
      />

      <div
        className={`bg-zinc-900 rounded-lg p-6 border border-emerald-500/30 overflow-y-auto h-full text-sm ${jetbrainsMono.className} w-full`}
      >
        <AnimatePresence mode="wait">
          {activeView === "json" && (
            <motion.div key="json" {...springAnimation}>
              <JsonVisualizerContent data={data} />
            </motion.div>
          )}
          {activeView === "types" && (
            <motion.div key="types" {...springAnimation}>
              <TypeVisualizerContent data={data as Record<string, unknown>} />
            </motion.div>
          )}
          {activeView === "usage" && (
            <motion.div key="usage" {...springAnimation}>
              <UsageVisualizerContent apiUrl={apiUrl} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Code,
  FileJson,
  BookOpen,
} from "lucide-react";
import { jetbrainsMono } from "@/styles/fonts";
import { JsonVisualizerContent } from "./JsonVisualizerContent";
import { TypeVisualizerContent } from "./TypeVisualizerContent";
import UsageVisualizerContent from "./UsageVisualizerContent";
import { Tabs } from "@/components/ui/vercel-tabs";

// Tipos compartilhados
export type ViewType = "json" | "types" | "usage";

interface JsonVisualizerProps {
  data: any;
  initialView?: ViewType;
  apiUrl: string;
}

// Componente principal que gerencia as tabs
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Componente de Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeView}
        onTabChange={(tabId) => setActiveView(tabId as ViewType)}
        className="mb-[5px] ml-2"
      />

      {/* Container principal com estilo comum */}
      <div
        className={`bg-zinc-900 h-auto rounded-lg p-6 border border-emerald-500/30 overflow-auto h-full text-sm ${jetbrainsMono.className} w-full`}
      >
        {/* Renderiza o componente adequado de acordo com a visualização ativa */}
        {activeView === "json" && <JsonVisualizerContent data={data} />}
        {activeView === "types" && <TypeVisualizerContent data={data} />}
        {activeView === "usage" && <UsageVisualizerContent apiUrl={apiUrl} />}
      </div>
    </div>
  );
};

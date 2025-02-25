"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { jetbrainsMono } from "@/styles/fonts";

interface JsonVisualizerProps {
  data: any;
}

const JsonVisualizer: React.FC<JsonVisualizerProps> = ({ data }) => {
  if (typeof data !== "object" || data === null) {
    return (
      <div
        className={`bg-zinc-900 rounded-lg p-6 border border-emerald-500/30 overflow-auto max-h-full min-h-auto lg:min-h-full text-sm ${jetbrainsMono.className} w-full`}
      >
        <JsonValue value={data} />
      </div>
    );
  }

  return (
    <div
      className={`bg-zinc-900 rounded-lg p-6 border border-emerald-500/30 overflow-auto max-h-full min-h-auto lg:min-h-full text-sm ${jetbrainsMono.className} w-full`}
    >
      <TopLevelContent data={data} />
    </div>
  );
};

const TopLevelContent: React.FC<{ data: object }> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);
  const objectName = Object.keys(data)[0];

  return (
    <div>
      <span className="text-emerald-300 cursor-pointer" onClick={toggleOpen}>
        {isOpen ? (
          <ChevronDown size={16} className="inline mr-1" />
        ) : (
          <ChevronRight size={16} className="inline mr-1" />
        )}
        <span className="text-emerald-300">{`"${objectName}": `}</span>
        {!isOpen && <span className="text-emerald-300">{"{...}"}</span>}
      </span>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <JsonContent data={data[objectName]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JsonContent: React.FC<{
  data: any;
  depth?: number;
}> = ({ data, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isObject = typeof data === "object" && data !== null;
  const isArray = Array.isArray(data);

  if (!isObject) {
    return <JsonValue value={data} />;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <span>
      <span className="text-emerald-300 cursor-pointer" onClick={toggleOpen}>
        {isOpen ? (
          <ChevronDown size={16} className="inline mr-1" />
        ) : (
          <ChevronRight size={16} className="inline mr-1" />
        )}
        {isArray ? "[" : "{"}
      </span>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ marginLeft: "1.5rem" }}
          >
            {Object.entries(data).map(([key, value], index, array) => (
              <div key={key} className="ml-4">
                <span className="text-emerald-300">
                  {isArray ? "" : `"${key}": `}
                </span>
                <JsonContent data={value} depth={depth + 1} />
                {index < array.length - 1 && (
                  <span className="text-emerald-300">,</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-emerald-300">{isArray ? "]" : "}"}</span>
    </span>
  );
};

const JsonValue: React.FC<{ value: any }> = ({ value }) => {
  const valueColor = (() => {
    switch (typeof value) {
      case "string":
        return "text-emerald-200";
      case "number":
        return "text-emerald-400";
      case "boolean":
        return "text-emerald-300";
      default:
        return "text-emerald-100";
    }
  })();

  const displayValue = JSON.stringify(value);

  return (
    <span
      className={`${jetbrainsMono.className} ${valueColor} break-all whitespace-normal`}
    >
      {displayValue}
    </span>
  );
};

export default JsonVisualizer;

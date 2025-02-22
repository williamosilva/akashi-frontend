"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { jetbrainsMono } from "@/styles/fonts";

interface JsonVisualizerProps {
  data: object;
}

const JsonVisualizer: React.FC<JsonVisualizerProps> = ({ data }) => {
  const renderJson = (obj: any, depth = 0) => {
    if (typeof obj !== "object" || obj === null) {
      return <JsonValue value={obj} />;
    }

    return Object.entries(obj).map(([key, value]) => (
      <JsonProperty key={key} name={key} value={value} depth={depth} />
    ));
  };

  return (
    <div
      className={`bg-zinc-900 rounded-lg p-6 border border-emerald-500/30 overflow-auto max-h-full min-h-auto lg:min-h-full text-sm ${jetbrainsMono.className} w-full`}
    >
      <div className="space-y-2 break-words">{renderJson(data)}</div>
    </div>
  );
};

const JsonProperty: React.FC<{ name: string; value: any; depth: number }> = ({
  name,
  value,
  depth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isExpandable = typeof value === "object" && value !== null;

  const isIdProperty =
    name.toLowerCase() === "id" || name.toLowerCase().endsWith("id");

  return (
    <div
      style={{ marginLeft: `${depth * 16}px` }}
      className="w-full overflow-hidden"
    >
      <div className="flex flex-wrap items-start space-x-1">
        {isExpandable && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex-shrink-0 mt-1"
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <span
          className={`${jetbrainsMono.className} text-emerald-300 flex-shrink-0`}
        >
          {name}:
        </span>
        {!isExpandable && (
          <JsonValue value={value} isIdProperty={isIdProperty} />
        )}
      </div>
      {isExpandable && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 space-y-1 overflow-hidden"
            >
              {Array.isArray(value)
                ? value.map((item, index) => (
                    <JsonProperty
                      key={index}
                      name={index.toString()}
                      value={item}
                      depth={depth + 1}
                    />
                  ))
                : Object.entries(value).map(([key, val]) => (
                    <JsonProperty
                      key={key}
                      name={key}
                      value={val}
                      depth={depth + 1}
                    />
                  ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const JsonValue: React.FC<{ value: any; isIdProperty?: boolean }> = ({
  value,
  isIdProperty,
}) => {
  const valueColor = (() => {
    if (isIdProperty) return "text-emerald-200";
    switch (typeof value) {
      case "string":
        return "text-emerald-200";
      case "number":
        return "text-emerald-200";
      case "boolean":
        return "text-emerald-200";
      default:
        return "text-emerald-200";
    }
  })();

  // Format strings that might be long
  const displayValue =
    typeof value === "string" && value.length > 80
      ? JSON.stringify(value)
      : JSON.stringify(value);

  return (
    <p
      className={`${jetbrainsMono.className} ${valueColor} break-all whitespace-normal max-w-full`}
      style={{
        fontWeight: 300,
      }}
    >
      {displayValue}
    </p>
  );
};

export default JsonVisualizer;

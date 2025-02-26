import { jetbrainsMono } from "@/styles/fonts";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const JsonVisualizerContent: React.FC<{ data: any }> = ({ data }) => {
  console.log(data);
  if (typeof data !== "object" || data === null) {
    return <JsonValue value={data} />;
  }

  return <TopLevelContent data={data} />;
};

const TopLevelContent: React.FC<{ data: Record<string, any> }> = ({ data }) => {
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
        <span className="text-emerald-300">{objectName}: </span>
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
            <JsonNodeContent data={data[objectName]} depth={0} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JsonNodeContent: React.FC<{
  data: any;
  depth: number;
}> = ({ data, depth }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
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
                  {isArray ? "" : `${key}: `}
                </span>
                <JsonNodeContent data={value} depth={depth + 1} />
                {index < array.length - 1 && (
                  <span className="text-emerald-300">,</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && <span className="text-emerald-300">...</span>}
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

  const displayValue =
    typeof value === "string" ? `"${value}"` : JSON.stringify(value);

  return (
    <span
      className={`${jetbrainsMono.className} ${valueColor} break-all whitespace-normal`}
    >
      {displayValue}
    </span>
  );
};

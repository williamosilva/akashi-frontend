import React, { JSX, useState } from "react";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { jetbrainsMono } from "@/styles/fonts";
import { Tooltip, TooltipProvider } from "../Tooltip";
import { Button } from "../button";
import { cn } from "@/lib/utils";

type ProgrammingLanguage = "typescript" | "python" | "java";

type DataObject = Record<string, unknown>;

export const TypeVisualizerContent: React.FC<{ data: DataObject }> = ({
  data,
}) => {
  const [activeLanguage, setActiveLanguage] =
    useState<ProgrammingLanguage>("typescript");

  const getTypeInfoTypeScript = (value: unknown): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]";
      const itemType = getTypeInfoTypeScript(value[0]);
      return `${itemType}[]`;
    }
    if (typeof value === "object") {
      return "object";
    }
    return typeof value;
  };

  const generateInterfaceName = (key: string): string => {
    return key
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  const getTypeInfoPython = (value: unknown): string => {
    if (value === null) return "None";
    if (Array.isArray(value)) {
      if (value.length === 0) return "list";
      const itemType = getTypeInfoPython(value[0]);
      return `list[${itemType}]`;
    }
    if (typeof value === "object") return "dict";
    if (typeof value === "string") return "str";
    if (typeof value === "number") return "float";
    if (typeof value === "boolean") return "bool";
    return "Any";
  };

  const renderPythonStructure = (
    data: DataObject,
    className: string = "Root"
  ): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedClassName = toPythonClassName(key);
        elements.push(
          ...renderPythonStructure(value as DataObject, nestedClassName)
        );
      }
    });

    const fields = Object.entries(data);
    const classDef = (
      <div key={className}>
        <div className="text-emerald-300">class {className}(TypedDict):</div>
        {fields.length === 0 ? (
          <div style={{ marginLeft: `20px` }} className="text-emerald-200">
            pass
          </div>
        ) : (
          fields.map(([key, value]) => {
            const formattedKey = toPythonAttributeName(key);
            let fieldType = getTypeInfoPython(value);

            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              fieldType = toPythonClassName(key);
            }

            return (
              <div
                key={key}
                style={{ marginLeft: `20px` }}
                className="text-emerald-200"
              >
                {formattedKey}: {fieldType}
              </div>
            );
          })
        )}
      </div>
    );

    elements.push(classDef);

    if (className === "Root") {
      elements.unshift(
        <div key="python-imports" className="text-emerald-300">
          from typing import TypedDict
        </div>
      );
    }

    return elements;
  };

  const toPythonClassName = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  const toPythonAttributeName = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase();
  };

  const renderTypeScriptStructure = (
    data: unknown,
    rootName: string = "Root",
    indent: number = 0
  ): JSX.Element => {
    if (typeof data !== "object" || data === null) {
      return (
        <div
          style={{ marginLeft: `${indent * 20}px` }}
          className="text-emerald-300"
        >
          {getTypeInfoTypeScript(data)}
        </div>
      );
    }

    const dataObj = data as Record<string, unknown>;
    const isArray = Array.isArray(data);

    if (isArray) {
      const itemType = data.length > 0 ? getTypeInfoTypeScript(data[0]) : "any";
      return (
        <div
          style={{ marginLeft: `${indent * 20}px` }}
          className="text-emerald-300"
        >
          {itemType}[]
        </div>
      );
    }

    const entries = Object.entries(dataObj);

    if (entries.length === 0) {
      return (
        <div
          style={{ marginLeft: `${indent * 20}px` }}
          className="text-emerald-300"
        >
          export interface {rootName} {"{}"}
        </div>
      );
    }

    const interfaces: JSX.Element[] = [];

    interfaces.push(
      <div key={`${rootName}-main`}>
        <div
          style={{ marginLeft: `${indent * 20}px` }}
          className="text-emerald-300"
        >
          export interface {rootName} {"{"}
        </div>
        {entries.map(([key, value]) => {
          const propertyType =
            typeof value === "object" && value !== null
              ? Array.isArray(value)
                ? `${
                    value.length > 0 ? getTypeInfoTypeScript(value[0]) : "any"
                  }[]`
                : generateInterfaceName(key)
              : getTypeInfoTypeScript(value);

          return (
            <div
              key={key}
              style={{ marginLeft: `${(indent + 1) * 20}px` }}
              className="text-emerald-200"
            >
              {key.includes(" ") || key.includes("-") ? `"${key}"` : key}:{" "}
              {propertyType}
            </div>
          );
        })}
        <div
          style={{ marginLeft: `${indent * 20}px` }}
          className="text-emerald-300"
        >
          {"}"}
        </div>
      </div>
    );

    entries.forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        interfaces.push(
          <div key={`${key}-nested`} style={{ marginTop: "10px" }}>
            {renderTypeScriptStructure(
              value,
              generateInterfaceName(key),
              indent
            )}
          </div>
        );
      }
    });

    return <>{interfaces}</>;
  };

  const toJavaFieldName = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]/g, " ")
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toLowerCase() + word.slice(1)
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  };

  const getTypeInfoJava = (value: unknown, parentKey?: string): string => {
    if (value === null) return "Object";
    if (Array.isArray(value)) {
      if (value.length === 0) return "List<Object>";
      const itemType = getTypeInfoJava(value[0]);
      return `List<${itemType}>`;
    }
    if (typeof value === "object") {
      return parentKey ? generateInterfaceName(parentKey) : "Object";
    }
    if (typeof value === "string") return "String";
    if (typeof value === "number")
      return Number.isInteger(value) ? "Integer" : "Double";
    if (typeof value === "boolean") return "Boolean";
    return "Object";
  };

  const renderJavaStructure = (
    data: unknown,
    className: string = "RootModel",
    indent: number = 0
  ): JSX.Element => {
    if (typeof data !== "object" || data === null) {
      return <div className="text-emerald-300">{getTypeInfoJava(data)}</div>;
    }

    const dataObj = data as Record<string, unknown>;

    const fields = Object.entries(dataObj);
    const classes: JSX.Element[] = [];

    fields.forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedClassName = generateInterfaceName(key);
        classes.push(renderJavaStructure(value, nestedClassName, indent + 1));
      }
    });

    const classContent = (
      <div key={className} style={{ marginLeft: `${indent * 20}px` }}>
        <div className="text-emerald-300">
          public class {className} {"{"}
        </div>

        {fields.map(([key, value]) => {
          const fieldName = toJavaFieldName(key);
          const type = getTypeInfoJava(value, key);

          return (
            <div key={key}>
              <div
                style={{ marginLeft: `${(indent + 1) * 20}px` }}
                className="text-emerald-200"
              >
                private {type} {fieldName};
              </div>

              <div
                style={{ marginLeft: `${(indent + 1) * 20}px` }}
                className="text-emerald-300"
              >
                public {type} get
                {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}() {"{"}
                <span className="ml-4">return this.{fieldName};</span>
                {"}"}
              </div>
              <div
                style={{ marginLeft: `${(indent + 1) * 20}px` }}
                className="text-emerald-300"
              >
                public void set
                {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}({type}{" "}
                {fieldName}) {"{"}
                <span className="ml-4">
                  this.{fieldName} = {fieldName};
                </span>
                {"}"}
              </div>
            </div>
          );
        })}

        <div className="text-emerald-300">{"}"}</div>
      </div>
    );

    return (
      <div key={className}>
        {classes}
        {classContent}
      </div>
    );
  };

  const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Falha ao copiar: ", err);
      }
    };

    return (
      <TooltipProvider>
        <Tooltip
          content="Click to copy"
          position="top"
          className="absolute right-4 top-4"
        >
          <Button
            variant="outline"
            size="icon"
            className="disabled:opacity-100 bg-[#1c1c1d9f]"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            disabled={copied}
          >
            <div
              className={cn(
                "transition-all",
                copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            >
              <Check
                className="stroke-emerald-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
            <div
              className={cn(
                "absolute transition-all",
                copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
            >
              <Copy size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </Button>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const generateTypeScriptCode = (
    data: unknown,
    rootName: string = "Root",
    indent: number = 0
  ): string => {
    let code = "";
    const indentStr = "  ".repeat(indent);

    if (typeof data !== "object" || data === null) {
      return `${indentStr}${getTypeInfoTypeScript(data)}\n`;
    }

    if (Array.isArray(data)) {
      const itemType = data.length > 0 ? getTypeInfoTypeScript(data[0]) : "any";
      return `${indentStr}${itemType}[]\n`;
    }

    const dataObj = data as Record<string, unknown>;
    code += `${indentStr}export interface ${rootName} {\n`;
    Object.entries(dataObj).forEach(([key, value]) => {
      const propName =
        key.includes(" ") || key.includes("-") ? `"${key}"` : key;
      let propType = getTypeInfoTypeScript(value);

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedName = generateInterfaceName(key);
        code += generateTypeScriptCode(value, nestedName, indent);
        propType = nestedName;
      }

      code += `${indentStr}  ${propName}: ${propType};\n`;
    });
    code += `${indentStr}}\n\n`;

    return code;
  };

  const generatePythonCode = (
    data: DataObject,
    className: string = "Root"
  ): string => {
    let code = "";
    const indent = (level: number) => "    ".repeat(level);

    Object.entries(data).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedName = toPythonClassName(key);
        code += generatePythonCode(value as DataObject, nestedName);
      }
    });

    code += `class ${className}(TypedDict):\n`;
    if (Object.entries(data).length === 0) {
      code += indent(1) + "pass\n";
    } else {
      Object.entries(data).forEach(([key, value]) => {
        const attrName = toPythonAttributeName(key);
        let type = getTypeInfoPython(value);
        if (typeof value === "object" && !Array.isArray(value)) {
          type = toPythonClassName(key);
        }
        code += indent(1) + `${attrName}: ${type}\n`;
      });
    }
    code += "\n";

    if (className === "Root") {
      code = "from typing import TypedDict\n\n" + code;
    }

    return code;
  };

  const generateJavaCode = (
    data: unknown,
    className: string = "RootModel",
    indentLevel: number = 0
  ): string => {
    let code = "";
    const indent = (level: number) => "    ".repeat(level);

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      const dataObj = data as Record<string, unknown>;

      Object.entries(dataObj).forEach(([key, value]) => {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          const nestedName = generateInterfaceName(key);
          code += generateJavaCode(value, nestedName, indentLevel + 1);
        }
      });

      code += indent(indentLevel) + `public class ${className} {\n`;
      Object.entries(dataObj).forEach(([key, value]) => {
        const fieldName = toJavaFieldName(key);
        const type = getTypeInfoJava(value, key);
        code += indent(indentLevel + 1) + `private ${type} ${fieldName};\n`;
      });

      Object.entries(dataObj).forEach(([key, value]) => {
        const fieldName = toJavaFieldName(key);
        const type = getTypeInfoJava(value, key);
        const CapName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        code += indent(indentLevel + 1) + `public ${type} get${CapName}() {\n`;
        code += indent(indentLevel + 2) + `return this.${fieldName};\n`;
        code += indent(indentLevel + 1) + "}\n";

        code +=
          indent(indentLevel + 1) +
          `public void set${CapName}(${type} ${fieldName}) {\n`;
        code += indent(indentLevel + 2) + `this.${fieldName} = ${fieldName};\n`;
        code += indent(indentLevel + 1) + "}\n";
      });

      code += indent(indentLevel) + "}\n\n";
    }

    return code;
  };

  const codeToCopy = React.useMemo(() => {
    switch (activeLanguage) {
      case "typescript":
        return generateTypeScriptCode(data);
      case "python":
        return generatePythonCode(data);
      case "java":
        return generateJavaCode(data);
      default:
        return "";
    }
  }, [activeLanguage, data]);

  return (
    <div className="mb-0">
      <div className="flex flex-wrap gap-3 pb-4">
        <div className="relative group">
          <button
            onClick={() => setActiveLanguage("typescript")}
            className={`inline-flex items-center gap-2 rounded-lg border p-2 text-sm font-medium transition-colors ${
              activeLanguage === "typescript"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "border-input bg-[#131314] text-emerald-300/80 hover:bg-emerald-500/5 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <div className="w-auto h-auto rounded-sm overflow-hidden">
              <Image
                src="/images/typescript_icon.png"
                alt="Akashi Logo"
                width={20}
                height={20}
                className="select-none"
              />
            </div>
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => setActiveLanguage("python")}
            className={`inline-flex items-center gap-2 rounded-lg border p-2 text-sm font-medium transition-colors ${
              activeLanguage === "python"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "border-input bg-[#131314] text-emerald-300/80 hover:bg-emerald-500/5 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <div className="w-auto h-auto rounded-sm overflow-hidden">
              <Image
                src="/images/python_icon.webp"
                alt="Akashi Logo"
                width={20}
                height={20}
                className="select-none"
              />
            </div>
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => setActiveLanguage("java")}
            className={`inline-flex items-center gap-2 rounded-lg border p-2  justify-center text-sm font-medium transition-colors ${
              activeLanguage === "java"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "border-input bg-[#131314] text-emerald-300/80 hover:bg-emerald-500/5 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <div className="w-5 h-5 rounded-sm overflow-hidden bg-white flex justify-center items-center">
              <Image
                src="/images/java_icon.png"
                alt="Akashi Logo"
                width={14.9}
                height={20}
                className="select-none"
              />
            </div>
          </button>
        </div>
      </div>

      <div className="mb-0">
        <div
          className={`bg-zinc-800 rounded-lg p-6 overflow-auto h-full text-sm ${jetbrainsMono.className} w-full relative`}
        >
          <CopyButton textToCopy={codeToCopy} />

          {activeLanguage === "typescript" && renderTypeScriptStructure(data)}
          {activeLanguage === "python" && (
            <div>
              {renderPythonStructure(data).map((el, i) =>
                React.cloneElement(el as React.ReactElement, { key: `py-${i}` })
              )}
            </div>
          )}
          {activeLanguage === "java" && renderJavaStructure(data)}
        </div>
      </div>
    </div>
  );
};

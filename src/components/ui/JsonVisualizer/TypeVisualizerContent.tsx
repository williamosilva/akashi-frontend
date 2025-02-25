import React, { JSX, useState } from "react";
import { Code } from "lucide-react";
import Image from "next/image";

type ProgrammingLanguage = "typescript" | "python" | "java";

export const TypeVisualizerContent: React.FC<{ data: any }> = ({ data }) => {
  const [activeLanguage, setActiveLanguage] =
    useState<ProgrammingLanguage>("typescript");

  // Função para determinar o tipo em TypeScript
  const getTypeInfoTypeScript = (value: any): string => {
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

  // Gera um nome de interface baseado em uma chave
  const generateInterfaceName = (key: string): string => {
    // Transforma chaves como "New Object" em "NewObject"
    return key
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  const getTypeInfoPython = (value: any): string => {
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
    data: any,
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
        elements.push(...renderPythonStructure(value, nestedClassName));
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

  // Função corrigida para renderizar a estrutura TypeScript
  const renderTypeScriptStructure = (
    data: any,
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

    // Para objetos, criar interfaces separadas
    const entries = Object.entries(data);

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

    // Interface principal
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

    // Interfaces aninhadas
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

  // Função para converter chaves para camelCase
  const toJavaFieldName = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]/g, " ") // Substitui caracteres especiais por espaços
      .split(" ")
      .map(
        (word, index) =>
          index === 0
            ? word.charAt(0).toLowerCase() + word.slice(1) // Primeira palavra em minúsculo
            : word.charAt(0).toUpperCase() + word.slice(1) // Demais palavras em PascalCase
      )
      .join("");
  };

  // Função para determinar o tipo em Java (atualizada)
  const getTypeInfoJava = (value: any, parentKey?: string): string => {
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

  // Função de renderização Java corrigida
  const renderJavaStructure = (
    data: any,
    className: string = "RootModel",
    indent: number = 0
  ): JSX.Element => {
    if (typeof data !== "object" || data === null) {
      return <div className="text-emerald-300">{getTypeInfoJava(data)}</div>;
    }

    const isArray = Array.isArray(data);
    const fields = Object.entries(data);
    const classes: JSX.Element[] = [];

    // Primeiro processa os campos aninhados
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

    // Construir a classe atual
    const classContent = (
      <div key={className} style={{ marginLeft: `${indent * 20}px` }}>
        <div className="text-emerald-300">
          public class {className} {"{"}
        </div>

        {fields.map(([key, value]) => {
          const fieldName = toJavaFieldName(key); // Usa a nova função de conversão
          const type = getTypeInfoJava(value, key);

          return (
            <div key={key}>
              <div
                style={{ marginLeft: `${(indent + 1) * 20}px` }}
                className="text-emerald-200"
              >
                private {type} {fieldName}; {/* Agora em camelCase */}
              </div>

              {/* Getters e Setters com camelCase */}
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
      <div>
        {classes}
        {classContent}
      </div>
    );
  };

  return (
    <div className="mb-6">
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

      <div className="mb-6">
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
  );
};

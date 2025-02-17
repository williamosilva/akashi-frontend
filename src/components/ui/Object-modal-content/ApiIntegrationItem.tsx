"use client";

import { useState } from "react";
import { JSONPath } from "jsonpath-plus";

import {
  ChevronDown,
  ChevronUp,
  EyeIcon,
  EyeOffIcon,
  Trash,
} from "lucide-react";
import type { ApiIntegrationValue, ApiIntegrationItemProps } from "@/types";

export function ApiIntegrationItem({
  propertyKey,
  value,
  onValueChange,
  onKeyChange,
  onDeleteKey,
  expanded,
  loading,
  apiResponse,
  setExpanded,
  setLoading,
  setApiResponse,
}: ApiIntegrationItemProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleTryApi = async () => {
    console.log("Trying API...");
    console.log(value);

    // Resetar resposta anterior
    setApiResponse(null);
    setLoading(true);

    try {
      // Verificar campos obrigatórios
      if (!value.apiUrl) {
        setApiResponse({ error: "API URL é obrigatória" });
        return;
      }

      // Construir headers dinamicamente
      const headers: Record<string, string> = {};
      const apiKeyField = Object.keys(value).find(
        (k) => k !== "apiUrl" && k !== "JSONPath"
      );

      if (apiKeyField && value[apiKeyField]) {
        headers[apiKeyField] = value[apiKeyField];
      }

      // Fazer a requisição
      const response = await fetch(value.apiUrl, {
        method: "GET",
        headers,
      });

      // Processar resposta
      const responseData = await response.json();

      if (!response.ok) {
        setApiResponse({
          error: `Erro ${response.status}: ${response.statusText}`,
          details: responseData,
        });
        return;
      }

      // Aplicar JSONPath se existir
      if (value.JSONPath) {
        try {
          const results = JSONPath({
            path: value.JSONPath,
            json: responseData,
          });
          setApiResponse(
            results.length > 0
              ? { data: results }
              : {
                  error: "JSONPath não retornou resultados",
                }
          );
        } catch (error) {
          setApiResponse({
            error: "Erro no JSONPath",
            details:
              error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      } else {
        setApiResponse({ data: responseData });
      }
    } catch (error) {
      setApiResponse({
        error: "Erro na requisição",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-3 rounded-lg border border-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0px_10px_rgba(0,0,0,0.25)] hover:shadow-emerald-500/10 transition-all group bg-zinc-800 col-span-full">
      <div className="flex items-center sm:w-full w-auto flex-1 sm:flex-0">
        <div className="flex-1 flex md:flex-row flex-col items-center md:gap-0 gap-2 md:space-x-10 space-x-0">
          <div className="w-full">
            <span className="text-xs text-emerald-500 mb-2">
              API Integration
            </span>
            <input
              type="text"
              defaultValue={propertyKey}
              className="flex- w-auto sm:w-full sm:flex-1 text-emerald-300 text-sm font-medium bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
              onChange={(e) => onKeyChange(propertyKey, e.target.value)}
            />
          </div>
          <div className="md:w-[91%] w-full flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-300 text-sm">apiUrl:</span>
              <input
                type="text"
                defaultValue={value.apiUrl}
                className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                onChange={(e) =>
                  onValueChange(propertyKey, {
                    ...value,
                    apiUrl: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-300 text-sm w-[70px]">
                JSONPath:
              </span>
              <input
                type="text"
                defaultValue={value.JSONPath}
                className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                onChange={(e) =>
                  onValueChange(propertyKey, {
                    ...value,
                    JSONPath: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-[38%]">
                <input
                  type="text"
                  defaultValue={
                    Object.keys(value).find(
                      (k) => k !== "apiUrl" && k !== "JSONPath"
                    ) || "x_api_key"
                  }
                  className="w-full text-emerald-300 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                  onChange={(e) => {
                    const oldKey = Object.keys(value).find(
                      (k) => k !== "apiUrl" && k !== "JSONPath"
                    );
                    const newValue = { ...value } as ApiIntegrationValue;
                    if (oldKey) {
                      const headerValue = newValue[oldKey];
                      delete newValue[oldKey];
                      newValue[e.target.value] = headerValue;
                    }
                    onValueChange(propertyKey, newValue);
                  }}
                />
              </div>
              <span className="text-emerald-300">|</span>
              <div className="flex items-center w-full">
                <input
                  type={showApiKey ? "text" : "password"}
                  defaultValue={
                    Object.values(value).find(
                      (_, i) =>
                        Object.keys(value)[i] !== "apiUrl" &&
                        Object.keys(value)[i] !== "JSONPath"
                    ) || ""
                  }
                  className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                  onChange={(e) => {
                    const headerKey =
                      Object.keys(value).find(
                        (k) => k !== "apiUrl" && k !== "JSONPath"
                      ) || "x_api_key";
                    onValueChange(propertyKey, {
                      ...value,
                      [headerKey]: e.target.value,
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-r px-2 py-1 focus:outline-none"
                >
                  {showApiKey ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                  <span className="sr-only">
                    {showApiKey ? "Hide API Key" : "Show API Key"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDeleteKey(propertyKey)}
          className="ml-2 text-zinc-400 opacity-100 hover:text-red-400 transition-all"
        >
          <Trash size={14} />
        </button>
      </div>
      <div className="mt-4 w-full bg-zinc-900 rounded-lg relative">
        <div
          className={`overflow-hidden transition-[height] duration-300 ease-in-out ${
            expanded ? "h-40" : "h-[68px]"
          }`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <pre className="text-zinc-400 text-sm overflow-x-auto pr-32">
              {loading ? (
                <span className="text-orange-500">Carregando...</span>
              ) : apiResponse ? (
                <>
                  {apiResponse.error && (
                    <div className="text-red-400">
                      <div>Erro: {apiResponse.error}</div>
                      {apiResponse.details && (
                        <div className="text-red-300">
                          Detalhes: {JSON.stringify(apiResponse.details)}
                        </div>
                      )}
                    </div>
                  )}
                  {apiResponse.data && (
                    <code className="block w-full whitespace-pre-wrap break-all">
                      {JSON.stringify(apiResponse.data, null, 2)}
                    </code>
                  )}
                </>
              ) : (
                <span className="text-zinc-500">Nenhum dado recebido</span>
              )}
            </pre>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-2 py-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            onClick={handleTryApi}
            className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Trying..." : "Try"}
          </button>
        </div>
      </div>
    </div>
  );
}

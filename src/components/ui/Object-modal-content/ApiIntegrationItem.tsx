"use client";
import { use, useEffect, useRef, useState } from "react";
import { JSONPath } from "jsonpath-plus";
import {
  ChevronDown,
  ChevronUp,
  EyeIcon,
  EyeOffIcon,
  Trash,
} from "lucide-react";
import type { ApiIntegrationItemProps } from "@/types";
import { useMediaQuery } from "react-responsive";

export function ApiIntegrationItem({
  propertyKey,
  value,
  onValueChange,
  onKeyChange,
  onDeleteKey,
  editable,
  error,
  existingKeys = [],
}: ApiIntegrationItemProps) {
  // Estados internos
  const [showApiKey, setShowApiKey] = useState(false);
  const [draftKey, setDraftKey] = useState(propertyKey || "");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [localError, setLocalError] = useState<string | undefined>(error);

  const prevPropertyKeyRef = useRef(propertyKey);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(max-width: 395px)",
  });
  useEffect(() => {
    if (prevPropertyKeyRef.current !== propertyKey) {
      setDraftKey(propertyKey || "");
      prevPropertyKeyRef.current = propertyKey;
    }
  }, [propertyKey]);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const validateKey = (newKey: string): boolean => {
    if (newKey === propertyKey) return true;

    if (existingKeys?.includes(newKey)) {
      setLocalError(`A chave "${newKey}" já existe`);
      return false;
    }

    setLocalError(undefined);
    return true;
  };

  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setDraftKey(newKey);

    // Validar enquanto o usuário digita para feedback imediato
    if (newKey !== propertyKey && existingKeys?.includes(newKey)) {
      setLocalError(`A chave "${newKey}" já existe`);
    } else {
      setLocalError(undefined);
    }
  };

  // Corrigido para espelhar a lógica do PropertyItem
  const handleKeyChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newKey = e.target.value;

    // Se a validação falhar, restaurar o valor anterior
    if (!validateKey(newKey)) {
      // Deixamos o erro visível, mas restauramos o valor original no estado local
      setDraftKey(propertyKey || "");
      return;
    }

    // Se passar na validação, prosseguir com a alteração
    if (newKey !== propertyKey && propertyKey) {
      onKeyChange(propertyKey, newKey);
    }
  };

  const handleTryApi = async () => {
    setApiResponse(null);
    setLoading(true);

    try {
      if (!value.apiUrl) {
        setApiResponse({ error: "API URL é obrigatória" });
        return;
      }

      const headers: Record<string, string> = {};
      const apiKeyField = Object.keys(value).find(
        (k) => k !== "apiUrl" && k !== "JSONPath"
      );

      if (apiKeyField && value[apiKeyField]) {
        headers[apiKeyField] = value[apiKeyField];
      }

      const response = await fetch(value.apiUrl, { method: "GET", headers });
      const responseData = await response.json();

      if (!response.ok) {
        setApiResponse({
          error: `Erro ${response.status}: ${response.statusText}`,
          details: responseData,
        });
        return;
      }

      if (value.JSONPath) {
        try {
          const results = JSONPath({
            path: value.JSONPath,
            json: responseData,
          });
          setApiResponse(
            results.length > 0
              ? { data: results }
              : { error: "JSONPath não retornou resultados" }
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

      // Removido a parte onde armazenava o responseData em value.dataReturn
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setApiResponse({ error: "Erro na requisição", details: errorMessage });

      // Removido a parte onde armazenava o erro em value.dataReturn
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-3 rounded-lg flex-1 border relative border-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0px_10px_rgba(0,0,0,0.25)] hover:shadow-emerald-500/10 transition-all group bg-zinc-800 col-span-full">
      <div className="flex items-center w-full relative ">
        <div className="flex md:flex-row flex-col items-center md:gap-0 gap-2 md:space-x-10 space-x-0 w-full">
          <div className="w-full flex sm:flex-col flex-row items-center sm:items-start sm:gap-0 gap-2">
            <span className="text-xs  text-emerald-500 sm:mb-2 mb-0">
              API Integration
            </span>

            <input
              type="text"
              id="integrationName"
              style={{
                width: isDesktopOrLaptop ? "5rem" : "auto",
              }}
              value={draftKey}
              className={`flex-1 mr-8  w-fit flex sm:w-full sm:flex-1 text-emerald-300 text-sm font-medium bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1 ${
                localError ? "border border-red-500" : ""
              }
            `}
              onBlur={handleKeyChange}
              onChange={handleKeyInput}
              disabled={!editable}
            />
            {localError && (
              <div className="text-red-500 text-xs mt-1">{localError}</div>
            )}
          </div>
          <div className="md:w-[91%] w-full flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-300 text-sm">apiUrl:</span>
              <input
                type="text"
                id="apiUrl"
                value={value.apiUrl || ""}
                className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                onChange={(e) =>
                  onValueChange(propertyKey || "", {
                    ...value,
                    apiUrl: e.target.value,
                  })
                }
                disabled={!editable}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-300 text-sm w-[70px]">
                JSONPath:
              </span>
              <input
                type="text"
                id="JSONPath"
                value={value.JSONPath || ""}
                className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                onChange={(e) =>
                  onValueChange(propertyKey || "", {
                    ...value,
                    JSONPath: e.target.value,
                  })
                }
                disabled={!editable}
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative md:w-[38%] w-28">
                <input
                  type="text"
                  id="apiKey"
                  value={
                    Object.keys(value).find(
                      (k) => k !== "apiUrl" && k !== "JSONPath"
                    ) || "x-api-key"
                  }
                  className="md:w-full w-20 text-emerald-300 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                  onChange={(e) => {
                    const oldHeaderKey = Object.keys(value).find(
                      (k) => k !== "apiUrl" && k !== "JSONPath"
                    );
                    const newHeaderKey = e.target.value;

                    if (oldHeaderKey && oldHeaderKey !== newHeaderKey) {
                      const newValue = { ...value };
                      newValue[newHeaderKey] = newValue[oldHeaderKey];
                      delete newValue[oldHeaderKey];
                      onValueChange(propertyKey, newValue);
                    }
                  }}
                  disabled={!editable}
                />
              </div>
              <span className="text-emerald-300">|</span>
              <div className="flex items-center w-full">
                <input
                  type={showApiKey ? "text" : "password"}
                  id="apiResponse"
                  value={
                    Object.values(value).find(
                      (_, i) =>
                        Object.keys(value)[i] !== "apiUrl" &&
                        Object.keys(value)[i] !== "JSONPath"
                    ) || ""
                  }
                  className="w-full text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                  onChange={(e) => {
                    const headerKey =
                      Object.keys(value).find(
                        (k) => k !== "apiUrl" && k !== "JSONPath"
                      ) || "x-api-key";
                    onValueChange(propertyKey || "", {
                      ...value,
                      [headerKey]: e.target.value,
                    });
                  }}
                  disabled={!editable}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-r px-2 py-1 focus:outline-none"
                  disabled={!editable}
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
          onClick={() => onDeleteKey(propertyKey || "")}
          className="ml-2 sm:block hidden text-zinc-400 opacity-100 hover:text-red-400 transition-all"
          disabled={!editable}
        >
          <Trash size={14} />
        </button>
        <button
          onClick={() => onDeleteKey(propertyKey || "")}
          className="ml-2 sm:hidden absolute top-1 right-2 translate-[-50%, -50%] text-zinc-400 opacity-100 hover:text-red-400 transition-all"
          disabled={!editable}
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
            disabled={loading || !editable}
          >
            {loading ? "Trying..." : "Try"}
          </button>
        </div>
      </div>
    </div>
  );
}

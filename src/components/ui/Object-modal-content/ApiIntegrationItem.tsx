"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  EyeIcon,
  EyeOffIcon,
  Trash,
} from "lucide-react";

interface ApiResponse {
  error?: string;
  [key: string]: unknown;
}

export interface ApiIntegrationValue {
  apiUrl: string;
  ref: string;
  [key: string]: string;
}

interface ApiIntegrationItemProps {
  propertyKey: string;
  value: ApiIntegrationValue;
  onValueChange: (key: string, value: ApiIntegrationValue) => void;
  onKeyChange: (oldKey: string, newKey: string) => void;
  onDeleteKey: (key: string) => void;
  expanded: boolean;
  loading: boolean;
  apiResponse: ApiResponse | null;
  setExpanded: (expanded: boolean) => void;
  setLoading: (loading: boolean) => void;
  setApiResponse: (response: ApiResponse | null) => void;
}

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
    setLoading(true);
    try {
      const response = await fetch(value.apiUrl, {
        method: "GET",
        headers: {
          [Object.keys(value).find((k) => k !== "apiUrl" && k !== "ref") ||
          "x-api-key"]:
            Object.values(value).find(
              (_, i) =>
                Object.keys(value)[i] !== "apiUrl" &&
                Object.keys(value)[i] !== "ref"
            ) || "",
        },
      });
      const data = (await response.json()) as ApiResponse;
      setApiResponse(data);
    } catch (_) {
      setApiResponse({ error: "An error occurred while fetching data" });
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
              <span className="text-emerald-300 text-sm w-10">ref:</span>
              <input
                type="text"
                defaultValue={value.ref}
                className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                onChange={(e) =>
                  onValueChange(propertyKey, { ...value, ref: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-[38%]">
                <input
                  type="text"
                  defaultValue={
                    Object.keys(value).find(
                      (k) => k !== "apiUrl" && k !== "ref"
                    ) || "x_api_key"
                  }
                  className="w-full text-emerald-300 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                  onChange={(e) => {
                    const oldKey = Object.keys(value).find(
                      (k) => k !== "apiUrl" && k !== "ref"
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
                        Object.keys(value)[i] !== "ref"
                    ) || ""
                  }
                  className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                  onChange={(e) => {
                    const headerKey =
                      Object.keys(value).find(
                        (k) => k !== "apiUrl" && k !== "ref"
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
                <span className="text-orange-500">Loading...</span>
              ) : (
                apiResponse && (
                  <code className="block w-full whitespace-pre-wrap break-all">
                    {JSON.stringify(apiResponse, null, 2)}
                  </code>
                )
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

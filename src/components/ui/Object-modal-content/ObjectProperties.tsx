"use client";
import { useState } from "react";
import { PropertyItem } from "./PropertyItem";
import { ApiIntegrationItem } from "./ApiIntegrationItem";
import type {
  PropertyValue,
  SimplePropertyValue,
  ApiIntegrationValue,
  ApiResponse,
  ObjectPropertiesProps,
} from "@/types";

export function ObjectProperties({
  data,
  onUpdate,
  isApiEditable,
}: ObjectPropertiesProps) {
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>(
    {}
  );
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [apiResponses, setApiResponses] = useState<
    Record<string, ApiResponse | null>
  >({});

  // Garantir que data sempre seja um objeto
  const safeData = data || {};

  const handleValueChange = (key: string, value: PropertyValue) => {
    onUpdate({ ...safeData, [key]: value });
  };

  // Filtra apenas campos com valores definidos
  const filteredEntries = Object.entries(safeData)
    .filter(([_, value]) => {
      // Remover campos vazios e null/undefined
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
    .filter(([key]) => !["objectId", "dataReturn"].includes(key));
  // Ordena mantendo campos da API primeiro
  const sortedEntries = filteredEntries.sort(([keyA], [keyB]) => {
    const isApiA = ["apiUrl", "JSONPath", "x_api_key"].includes(keyA);
    const isApiB = ["apiUrl", "JSONPath", "x_api_key"].includes(keyB);

    if (isApiA === isApiB) return keyA.localeCompare(keyB);
    return isApiA ? -1 : 1;
  });

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const updatedObject = { ...safeData };
    const oldValue = updatedObject[oldKey];
    delete updatedObject[oldKey];
    updatedObject[newKey] = oldValue;
    onUpdate(updatedObject);
  };

  const handleDeleteKey = (keyToDelete: string) => {
    const updatedObject = { ...safeData };
    delete updatedObject[keyToDelete];
    onUpdate(updatedObject);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-1 max-h-[55vh] overflow-hidden overflow-y-auto">
      {sortedEntries.map(([key, value]) => {
        const isApiIntegration =
          key === "apiUrl" || key === "JSONPath" || key === "x_api_key";

        if (isApiIntegration) {
          return (
            <ApiIntegrationItem
              key={key}
              propertyKey={key}
              value={value as ApiIntegrationValue}
              onValueChange={handleValueChange}
              onKeyChange={handleKeyChange}
              onDeleteKey={handleDeleteKey}
              expanded={expandedStates[key] || false}
              loading={loadingStates[key] || false}
              apiResponse={apiResponses[key] || null}
              // @ts-ignore
              editable={isApiEditable}
              setExpanded={(expanded) =>
                setExpandedStates((prev) => ({ ...prev, [key]: expanded }))
              }
              setLoading={(loading) =>
                setLoadingStates((prev) => ({ ...prev, [key]: loading }))
              }
              setApiResponse={(response) =>
                setApiResponses((prev) => ({ ...prev, [key]: response }))
              }
            />
          );
        }

        return (
          <PropertyItem
            key={key}
            propertyKey={key}
            value={value as SimplePropertyValue}
            onValueChange={handleValueChange}
            onKeyChange={handleKeyChange}
            onDeleteKey={handleDeleteKey}
          />
        );
      })}
    </div>
  );
}

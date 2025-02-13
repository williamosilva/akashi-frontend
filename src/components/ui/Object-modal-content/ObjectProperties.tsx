"use client";
import { useState } from "react";
import { PropertyItem } from "./PropertyItem";
import { ApiIntegrationItem } from "./ApiIntegrationItem";
import type {
  ObjectItem,
  PropertyValue,
  SimplePropertyValue,
  ApiIntegrationValue,
} from "@/types";

interface ApiResponse {
  error?: string;
  [key: string]: unknown;
}

interface ObjectPropertiesProps {
  object: ObjectItem;
  sortAscending: boolean;
  onObjectUpdate: (updatedObject: ObjectItem) => void;
}

export function ObjectProperties({
  object,
  sortAscending,
  onObjectUpdate,
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

  const handleValueChange = (key: string, value: PropertyValue) => {
    onObjectUpdate({ ...object, [key]: value });
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const updatedObject = { ...object };
    const oldValue = updatedObject[oldKey];
    delete updatedObject[oldKey];
    updatedObject[newKey] = oldValue;
    onObjectUpdate(updatedObject);
  };

  const handleDeleteKey = (keyToDelete: string) => {
    if (keyToDelete !== "id" && keyToDelete !== "name") {
      const updatedObject = { ...object };
      delete updatedObject[keyToDelete];
      onObjectUpdate(updatedObject);
    }
  };

  const sortedEntries = Object.entries(object)
    .filter(([key]) => key !== "id" && key !== "name")
    .sort(([keyA], [keyB]) => {
      return sortAscending
        ? keyA.localeCompare(keyB)
        : keyB.localeCompare(keyA);
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-1 min-h-[55vh] max-h-[55vh] overflow-hidden overflow-y-auto">
      {sortedEntries.map(([key, value]) => {
        const isApiIntegration =
          typeof value === "object" &&
          value !== null &&
          "ref" in value &&
          "apiUrl" in value;

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

        // Only render PropertyItem for simple values
        const isSimpleValue =
          value === null ||
          value === undefined ||
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean";

        if (!isSimpleValue) {
          return null; // Skip complex objects that aren't API integrations
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

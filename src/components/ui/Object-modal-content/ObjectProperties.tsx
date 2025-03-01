"use client";
import { useState } from "react";
import { PropertyItem } from "./PropertyItem";
import { ApiIntegrationItem } from "./ApiIntegrationItem";
import type { ApiIntegrationValue, SimplePropertyValue } from "@/types";
import { cn } from "@/lib/utils";

interface ObjectPropertiesProps {
  data: Record<string, Record<string, unknown>>;
  onUpdate: (data: Record<string, Record<string, unknown>>) => void;
  isApiEditable: boolean;
  empty?: boolean;
  isLoading?: boolean;
}

export function ObjectProperties({
  data,
  onUpdate,
  empty,
  isLoading,
  isApiEditable,
}: ObjectPropertiesProps) {
  const [keyErrors, setKeyErrors] = useState<Record<string, string>>({});

  const objectId = Object.keys(data || {})[0] || "";
  const objectData = objectId ? data[objectId] : {};

  const getPropertyEntries = () => {
    return Object.entries(objectData)
      .filter(([, value]) => value !== null && value !== "")
      .map(([key, value]) => ({
        key,
        value,
        type: isApiIntegration(value) ? "api" : "simple",
      }));
  };

  const getAllKeys = () => Object.keys(objectData);

  const isApiIntegration = (value: unknown): value is ApiIntegrationValue => {
    return (
      typeof value === "object" &&
      value !== null &&
      "apiUrl" in value &&
      "JSONPath" in value
    );
  };

  const handlePropertyChange = (
    key: string,
    value: SimplePropertyValue | ApiIntegrationValue
  ) => {
    onUpdate({
      ...data,
      [objectId]: { ...objectData, [key]: value },
    });
  };

  const handleRenameProperty = (oldKey: string, newKey: string) => {
    if (newKey !== oldKey && Object.keys(objectData).includes(newKey)) {
      setKeyErrors({
        ...keyErrors,
        [oldKey]: `A chave "${newKey}" já existe`,
      });
      return;
    }

    if (keyErrors[oldKey]) {
      const updatedErrors = { ...keyErrors };
      delete updatedErrors[oldKey];
      setKeyErrors(updatedErrors);
    }

    const entries = Object.entries(objectData);
    const newEntries = entries.map(([key, value]) =>
      key === oldKey ? [newKey, value] : [key, value]
    );

    onUpdate({
      ...data,
      [objectId]: Object.fromEntries(newEntries),
    });
  };

  const handleDeleteProperty = (keyToDelete: string) => {
    if (keyErrors[keyToDelete]) {
      const updatedErrors = { ...keyErrors };
      delete updatedErrors[keyToDelete];
      setKeyErrors(updatedErrors);
    }

    const newObjectData = { ...objectData };
    delete newObjectData[keyToDelete];
    onUpdate({ ...data, [objectId]: newObjectData });
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-1 max-h-[55vh] overflow-y-auto transition-all duration-300 ",
        empty && "hidden",
        isLoading && "opacity-50 pointer-events-none"
      )}
    >
      {getPropertyEntries().map(({ key, value, type }) => (
        <div
          key={`${objectId}-${key}`}
          className={type === "api" ? "col-span-full" : ""}
        >
          {type === "api" ? (
            <ApiIntegrationItem
              propertyKey={key}
              value={value as ApiIntegrationValue}
              onValueChange={handlePropertyChange}
              onKeyChange={handleRenameProperty}
              onDeleteKey={handleDeleteProperty}
              editable={isApiEditable}
              existingKeys={getAllKeys().filter((k) => k !== key)}
              error={keyErrors[key]}
            />
          ) : (
            <PropertyItem
              propertyKey={key}
              value={value as SimplePropertyValue}
              onKeyChange={handleRenameProperty}
              onValueChange={handlePropertyChange}
              onDeleteKey={handleDeleteProperty}
              existingKeys={getAllKeys().filter((k) => k !== key)}
              error={keyErrors[key]}
            />
          )}
        </div>
      ))}
    </div>
  );
}

"use client";
import { useState } from "react";
import { PropertyItem } from "./PropertyItem";
import { ApiIntegrationItem } from "./ApiIntegrationItem";
import type { ApiIntegrationValue, SimplePropertyValue } from "@/types";

interface ObjectPropertiesProps {
  data: Record<string, Record<string, any>>;
  onUpdate: (data: Record<string, Record<string, any>>) => void;
  isApiEditable: boolean;
}

export function ObjectProperties({
  data,
  onUpdate,
  isApiEditable,
}: ObjectPropertiesProps) {
  // Dados do objeto principal
  const objectId = Object.keys(data || {})[0] || "";
  const objectData = objectId ? data[objectId] : {};

  // Classifica as propriedades mantendo a ordem original
  const getPropertyEntries = () => {
    return Object.entries(objectData)
      .filter(([_, value]) => value !== null && value !== "")
      .map(([key, value]) => ({
        key,
        value,
        type: isApiIntegration(value) ? "api" : "simple",
      }));
  };

  // Verifica se é uma integração API
  const isApiIntegration = (value: any): value is ApiIntegrationValue => {
    return (
      typeof value === "object" &&
      value !== null &&
      "apiUrl" in value &&
      "JSONPath" in value
    );
  };

  // Manipulação genérica de propriedades
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
    const { [keyToDelete]: _, ...rest } = objectData;
    onUpdate({ ...data, [objectId]: rest });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-1 max-h-[55vh] overflow-y-auto">
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
            />
          ) : (
            <PropertyItem
              propertyKey={key}
              value={value as SimplePropertyValue}
              onKeyChange={handleRenameProperty}
              onValueChange={handlePropertyChange}
              onDeleteKey={handleDeleteProperty}
            />
          )}
        </div>
      ))}
    </div>
  );
}

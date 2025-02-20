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
  // Local state to track key errors
  const [keyErrors, setKeyErrors] = useState<Record<string, string>>({});

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

  // Get all existing keys for validation
  const getAllKeys = () => Object.keys(objectData);

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
    // Validar se a nova chave já existe
    if (newKey !== oldKey && Object.keys(objectData).includes(newKey)) {
      // Atualizar estado de erro
      setKeyErrors({
        ...keyErrors,
        [oldKey]: `A chave "${newKey}" já existe`,
      });
      return; // Não prosseguir com a renomeação
    }

    // Limpar erro se existia
    if (keyErrors[oldKey]) {
      const { [oldKey]: _, ...remainingErrors } = keyErrors;
      setKeyErrors(remainingErrors);
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
    // Limpar erro relacionado à chave se existir
    if (keyErrors[keyToDelete]) {
      const { [keyToDelete]: _, ...remainingErrors } = keyErrors;
      setKeyErrors(remainingErrors);
    }

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

"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { ObjectHeader } from "./Object-modal-content/ObjectHeader";
import { ObjectProperties } from "./Object-modal-content/ObjectProperties";
import { ObjectActions } from "./Object-modal-content/ObjectActions";
import { ProjectService } from "@/services/project.service";
import type {
  ModalObjectProps,
  ProjectDataItem,
  SubscriptionPlan,
} from "@/types";

const DEFAULT_DATA: ProjectDataItem = {};

type SortOrder = "none" | "asc" | "desc";

export default function ModalObject({
  isVisible,
  projectId,
  itemKey,
  initialData,
  onClose,
}: ModalObjectProps) {
  const [currentData, setCurrentData] = useState<ProjectDataItem>(DEFAULT_DATA);
  const [userPlan] = useState<SubscriptionPlan>("premium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState(itemKey || "new-object");
  const [objectId, setObjectId] = useState<string | null>(null);
  const [objectName, setObjectName] = useState<string>("New Object");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  console.log("sortOrder", sortOrder);

  useEffect(() => {
    if (isVisible) {
      setError(null);
      // Reseta a ordenação para "none" quando o modal é aberto
      setSortOrder("none");

      if (initialData) {
        const keys = Object.keys(initialData);
        if (keys.length > 0) {
          const id = keys[0];
          const objectData = initialData[id];
          const { akashiObjectName, ...restData } = objectData;

          setObjectId(id);
          setCurrentData(restData);
          setCurrentKey(itemKey || id);
          setObjectName(akashiObjectName || itemKey || id);
        } else {
          setCurrentData(initialData);
          setCurrentKey(itemKey || "");
          setObjectId(null);
          setObjectName(itemKey || "New Object");
        }
      } else {
        setCurrentData({});
        setObjectId(null);
        setObjectName("New Object");
      }
    }
  }, [isVisible, initialData, itemKey]);

  // Get the base data
  const baseDataForProperties = objectId
    ? { [objectId]: currentData }
    : { [currentKey]: currentData };

  // Apply sorting to the properties (or not, based on sortOrder)
  const dataForProperties = (() => {
    const result = { ...baseDataForProperties };

    // Se não houver ordenação, retornar os dados como estão
    if (sortOrder === "none") {
      return result;
    }

    // Para cada objeto em dataForProperties
    Object.keys(result).forEach((key) => {
      if (typeof result[key] === "object" && result[key] !== null) {
        // Obter todas as chaves do objeto
        const sortedKeys = Object.keys(result[key]);

        // Ordenar as chaves (ascendente ou descendente)
        sortedKeys.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.localeCompare(b);
          } else {
            return b.localeCompare(a);
          }
        });

        // Criar um novo objeto ordenado
        const sortedObj = {};
        sortedKeys.forEach((propKey) => {
          sortedObj[propKey] = result[key][propKey];
        });

        // Substituir o objeto original pelo ordenado
        result[key] = sortedObj;
      }
    });

    return result;
  })();

  console.log("projectId objectId data", projectId, objectId, currentData);
  const handleSave = async () => {
    if (!projectId) return;

    console.log("projectId objectId data", projectId, objectId, currentData);

    try {
      setIsLoading(true);
      const payload = {
        ...currentData,
        akashiObjectName: objectName,
      };

      // Determina qual ID usar como entryId (objectId ou currentKey)
      const entryId = objectId || currentKey;

      await ProjectService.getInstance().updateDataInfoItem(
        projectId,
        entryId,
        payload
      );

      onClose(true);
    } catch (err) {
      setError("Failed to save changes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleObjectNameChange = (newName: string) => {
    setObjectName(newName);
  };

  console.log("newName", objectName);

  const handleObjectUpdate = (updatedData: Record<string, any>) => {
    const id = objectId || currentKey;
    const newData = updatedData[id];
    if (newData) {
      console.log("newData", newData);
      setCurrentData(newData);
    }
  };

  const handleCreateSimpleObject = () => {
    // Redefine o estado de ordenação para "none" ao criar um novo objeto
    setSortOrder("none");

    setCurrentData((prev) => ({
      simpleKeyExample: "valueExample", // Novo simples com chave única
      ...prev,
    }));
  };

  const handleCreateApiIntegration = () => {
    // Redefine o estado de ordenação para "none" ao criar uma nova integração
    setSortOrder("none");

    const newApiObject = {
      apiUrl: "",
      JSONPath: "",
      "x-api-key": "",
    };

    setCurrentData((prev) => ({
      apiKeyExample: newApiObject,
      ...prev,
    }));
  };

  // Função para alternar entre os três estados de ordenação
  const toggleSorting = () => {
    setSortOrder((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      if (prev === "desc") return "asc";
      return "none";
    });
  };

  // Para compatibilidade com a interface existente do ObjectHeader
  const sortAscending = sortOrder === "asc";

  console.log("currentData", currentData);
  console.log("dataForProperties", dataForProperties);
  console.log("sortOrder", sortOrder);

  return (
    <Modal isOpen={isVisible} onClose={() => onClose(false)}>
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="relative w-full  max-w-[1000px] mx-auto max-h-[100vh] min-h-80 flex flex-col rounded-lg h-auto px-0">
        <ObjectHeader
          name={objectName}
          userPlan={userPlan}
          sortAscending={sortAscending}
          setSortAscending={toggleSorting}
          onApiIntegrationCreate={handleCreateApiIntegration}
          onSimpleObjectCreate={handleCreateSimpleObject}
          onNameChange={handleObjectNameChange}
          empty={Object.keys(currentData).length === 0}
        />

        <ObjectProperties
          data={dataForProperties}
          onUpdate={handleObjectUpdate}
          isApiEditable={userPlan === "premium" || userPlan === "admin"}
          empty={Object.keys(currentData).length === 0}
        />

        <ObjectActions
          onSave={handleSave}
          // onDelete={handleDelete : undefined}
          isSaving={isLoading}
          empty={Object.keys(currentData).length === 0}
        />
      </div>
    </Modal>
  );
}

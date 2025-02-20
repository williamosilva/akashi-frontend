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

  useEffect(() => {
    if (isVisible) {
      setError(null);

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

  // Computar dataForProperties dinamicamente
  const dataForProperties = objectId
    ? { [objectId]: currentData }
    : { [currentKey]: currentData };

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

  const handleObjectUpdate = (updatedData: Record<string, any>) => {
    const id = objectId || currentKey;
    const newData = updatedData[id];
    if (newData) {
      console.log("newData", newData);
      setCurrentData(newData);
    }
  };

  // const handleCreateSimpleObject = () => {
  //   setCurrentData((prev) => ({
  //     " ": "valueExample", // Novo item primeiro
  //     ...prev, // Demais itens depois
  //   }));
  // };

  const handleCreateSimpleObject = () => {
    setCurrentData((prev) => ({
      simpleKeyExample: "valueExample", // Novo simples com chave única
      ...prev,
    }));
  };

  const handleCreateApiIntegration = () => {
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

  console.log("currentData", currentData);
  console.log("dataForProperties", dataForProperties);

  return (
    <Modal isOpen={isVisible} onClose={() => onClose(false)}>
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="relative w-full max-w-[1000px] mx-auto max-h-[100vh] min-h-80 flex flex-col rounded-lg h-auto px-0">
        <ObjectHeader
          name={objectName}
          userPlan={userPlan}
          sortAscending={false}
          setSortAscending={() => {}}
          onApiIntegrationCreate={handleCreateApiIntegration}
          onSimpleObjectCreate={handleCreateSimpleObject}
          onNameChange={handleObjectNameChange}
          empty={Object.keys(currentData).length === 0}
        />

        <ObjectProperties
          data={dataForProperties}
          onUpdate={handleObjectUpdate}
          isApiEditable={userPlan === "premium" || userPlan === "admin"}
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

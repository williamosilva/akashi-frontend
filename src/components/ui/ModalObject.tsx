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

const DEFAULT_DATA: ProjectDataItem = {
  objectId: "",
  apiUrl: "",
  JSONPath: "",
  x_api_key: "",
  dataReturn: null,
};

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

  console.log("ModalObject", projectId, itemKey, initialData);

  useEffect(() => {
    if (isVisible) {
      setError(null);

      if (initialData) {
        // Clonar dados iniciais excluindo dataReturn
        const { dataReturn, ...cleanData } = initialData;
        setCurrentData({
          ...cleanData,
          objectId: cleanData.objectId || "",
          apiUrl: cleanData.apiUrl || "",
          JSONPath: cleanData.JSONPath || "",
          x_api_key: cleanData.x_api_key || "",
        });
        setCurrentKey(itemKey || "");
      } else {
        // Resetar para dados padrão sem dataReturn
        setCurrentData({
          apiUrl: "",
          JSONPath: "",
          x_api_key: "",
        });
        setCurrentKey(`new-object-${Date.now()}`);
      }
    }
  }, [isVisible, initialData, itemKey]);

  const handleSave = async () => {
    if (!currentData || !projectId) return;

    try {
      setIsLoading(true);

      const payload = {
        ...currentData,
        // Garantir que campos da API estejam presentes
        apiUrl: currentData.apiUrl || undefined,
        JSONPath: currentData.JSONPath || undefined,
        x_api_key: currentData.x_api_key || undefined,
      };

      if (initialData) {
        // Atualização
        await ProjectService.getInstance().updateDataInfoItem(
          projectId,
          currentKey,
          payload
        );
      } else {
        // Criação
        await ProjectService.getInstance().updateDataInfoItem(
          projectId,
          currentKey,
          payload
        );
      }

      onClose(true);
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId || !currentKey) return;

    try {
      setIsLoading(true);
      await ProjectService.getInstance().deleteDataInfoItem(
        projectId,
        currentKey
      );
      onClose(true);
    } catch (err) {
      setError("Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (newName: string) => {
    setCurrentKey(newName);
  };

  return (
    <Modal isOpen={isVisible} onClose={() => onClose(false)}>
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="relative w-full max-w-[1000px] mx-auto max-h-[100vh] rounded-lg h-auto px-0">
        <ObjectHeader
          name={currentKey}
          userPlan={userPlan}
          isEditable={!initialData}
          onNameChange={handleNameChange}
        />

        <ObjectProperties
          data={currentData}
          onUpdate={(updated) =>
            setCurrentData((prev) => ({ ...prev, ...updated }))
          }
          isApiEditable={userPlan === "premium" || userPlan === "admin"}
        />

        <ObjectActions
          onSave={handleSave}
          onDelete={initialData ? handleDelete : undefined}
          isSaving={isLoading}
        />
      </div>
    </Modal>
  );
}

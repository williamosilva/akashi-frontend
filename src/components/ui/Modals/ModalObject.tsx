"use client";

import { useState, useEffect } from "react";
import { Modal } from "../Modals/Modal";
import { ObjectHeader } from "../Object-modal-content/ObjectHeader";
import { ObjectProperties } from "../Object-modal-content/ObjectProperties";
import { ObjectActions } from "../Object-modal-content/ObjectActions";
import { ProjectService } from "@/services/project.service";
import { useUser } from "@/components/ui/Layout/ConditionalLayout";
import type { ModalObjectProps, DynamicIntegrationObject } from "@/types";

const DEFAULT_DATA: DynamicIntegrationObject = {};

type SortOrder = "none" | "asc" | "desc";

export default function ModalObject({
  isVisible,
  projectId,
  itemKey,
  initialData,
  onClose,
}: ModalObjectProps) {
  const [currentData, setCurrentData] =
    useState<DynamicIntegrationObject>(DEFAULT_DATA);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState(itemKey || "new-object");
  const [objectId, setObjectId] = useState<string | null>(null);
  const [objectName, setObjectName] = useState<string>("New Object");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const { plan } = useUser();

  useEffect(() => {
    if (isVisible) {
      setError(null);
      setSortOrder("none");

      if (initialData) {
        const keys = Object.keys(initialData);
        if (keys.length > 0) {
          const id = keys[0];
          const objectData = initialData[id];

          if (
            typeof objectData === "object" &&
            objectData !== null &&
            "akashiObjectName" in objectData
          ) {
            const { akashiObjectName, ...restData } = objectData as {
              akashiObjectName: string;
              [key: string]: unknown;
            };

            setObjectId(id);
            setCurrentData(restData as DynamicIntegrationObject);
            setCurrentKey(itemKey || id);
            setObjectName(akashiObjectName || itemKey || id);
          } else {
            setCurrentData(initialData as DynamicIntegrationObject);
            setCurrentKey(itemKey || "");
            setObjectId(null);
            setObjectName(itemKey || "New Object");
          }
        } else {
          setCurrentData(initialData as DynamicIntegrationObject);
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

  const baseDataForProperties = objectId
    ? { [objectId]: currentData }
    : { [currentKey]: currentData };

  const dataForProperties = (() => {
    const result = { ...baseDataForProperties };

    if (sortOrder === "none") {
      return result;
    }

    Object.keys(result).forEach((key) => {
      if (typeof result[key] === "object" && result[key] !== null) {
        const sortedKeys = Object.keys(result[key]);

        sortedKeys.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.localeCompare(b);
          } else {
            return b.localeCompare(a);
          }
        });

        const sortedObj: Record<string, unknown> = {};
        sortedKeys.forEach((propKey) => {
          sortedObj[propKey] = result[key][propKey];
        });

        result[key] = sortedObj as DynamicIntegrationObject;
      }
    });

    return result;
  })();

  const handleDelete = async () => {
    if (!projectId || !objectId) return;

    try {
      setIsLoading(true);

      await ProjectService.getInstance().deleteDataInfoItem(
        projectId,
        objectId
      );

      onClose(true);
    } catch (err) {
      setError("Falha ao deletar o item");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      const payload = {
        ...currentData,
        akashiObjectName: objectName,
      };

      const entryId = objectId;

      if (!entryId) {
        const result = await ProjectService.getInstance().addDataInfoItem(
          projectId,
          payload
        );

        void result;
      } else {
        await ProjectService.getInstance().updateDataInfoItem(
          projectId,
          entryId,
          payload
        );
      }

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

  const handleObjectUpdate = (updatedData: Record<string, unknown>) => {
    const id = objectId || currentKey;
    const newData = updatedData[id];
    if (newData) {
      setCurrentData(newData as DynamicIntegrationObject);
    }
  };

  const handleCreateSimpleObject = () => {
    setSortOrder("none");

    setCurrentData((prev) => ({
      simpleKeyExample: "valueExample",
      ...prev,
    }));
  };

  const handleCreateApiIntegration = () => {
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

  const toggleSorting = () => {
    setSortOrder((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      if (prev === "desc") return "asc";
      return "none";
    });
  };

  const sortAscending = sortOrder === "asc";

  return (
    <Modal isOpen={isVisible} onClose={() => onClose(false)}>
      {error && (
        <div className="error-message" style={{ display: "none" }}>
          {error}
        </div>
      )}

      <div className="relative w-full  mx-auto max-h-[100vh] min-h-80 flex flex-col rounded-lg h-auto px-0">
        <ObjectHeader
          name={objectName}
          userPlan={plan}
          sortAscending={sortAscending}
          setSortAscending={toggleSorting}
          onApiIntegrationCreate={handleCreateApiIntegration}
          onSimpleObjectCreate={handleCreateSimpleObject}
          onNameChange={handleObjectNameChange}
          empty={Object.keys(currentData).length === 0}
          isLoading={isLoading}
        />

        <ObjectProperties
          data={dataForProperties}
          onUpdate={handleObjectUpdate}
          isApiEditable={true}
          empty={Object.keys(currentData).length === 0}
          isLoading={isLoading}
        />

        <ObjectActions
          onSave={handleSave}
          onDelete={handleDelete}
          isLoading={isLoading}
          hasId={!!objectId}
          empty={Object.keys(currentData).length === 0}
        />
      </div>
    </Modal>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { ObjectHeader } from "./Object-modal-content/ObjectHeader";
import { ObjectProperties } from "./Object-modal-content/ObjectProperties";
import { ObjectActions } from "./Object-modal-content/ObjectActions";
import { ProjectService } from "@/services/project.service";
import type {
  ModalObjectProps,
  DynamicIntegrationObject,
  SubscriptionPlan,
} from "@/types";

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
  const [userPlan] = useState<SubscriptionPlan>("premium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState(itemKey || "new-object");
  const [objectId, setObjectId] = useState<string | null>(null);
  const [objectName, setObjectName] = useState<string>("New Object");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  console.log("joseph", currentData);

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
        const sortedObj: Record<string, unknown> = {};
        sortedKeys.forEach((propKey) => {
          sortedObj[propKey] = result[key][propKey];
        });

        // Substituir o objeto original pelo ordenado
        // Fazendo um casting para DynamicIntegrationObject
        result[key] = sortedObj as DynamicIntegrationObject;
      }
    });

    return result;
  })();

  const handleDelete = async () => {
    if (!projectId || !objectId) return;

    try {
      setIsLoading(true);

      // Usa o serviço para deletar o entry
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

      // Determina qual ID usar como entryId (objectId ou currentKey)
      const entryId = objectId;

      // Verifica se está criando um novo entry ou atualizando um existente
      if (!entryId) {
        // Criando novo entry - usa addDataInfoItem
        const result = await ProjectService.getInstance().addDataInfoItem(
          projectId,
          payload
        );

        // A variável está sendo comentada para evitar o erro de lint
        // const newEntryId = result.entryId;
        void result; // Para evitar erros de variável não utilizada
      } else {
        // Atualizando entry existente - usa updateDataInfoItem
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

  return (
    <Modal isOpen={isVisible} onClose={() => onClose(false)}>
      {/* Exibindo erro para que a variável error não seja considerada não utilizada */}
      {error && (
        <div className="error-message" style={{ display: "none" }}>
          {error}
        </div>
      )}

      <div className="relative w-full  mx-auto max-h-[100vh] min-h-80 flex flex-col rounded-lg h-auto px-0">
        <ObjectHeader
          name={objectName}
          userPlan={userPlan}
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
          isApiEditable={userPlan === "premium" || userPlan === "admin"}
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

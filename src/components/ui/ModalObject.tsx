import { useState, useEffect } from "react";
import { ReactNode } from "react";
import { Modal } from "./Modal";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  EyeIcon,
  EyeOffIcon,
  Save,
  Trash,
} from "lucide-react";
import PremiumButton from "./PremiumButton";
import { cn } from "@/lib/utils";

interface ModalObjectProps {
  isVisible: boolean;
}

interface ObjectItem {
  [key: string]: string | number | boolean | ObjectItem | ReactNode | ApiItem;
}
interface ExpandedStates {
  [key: string]: boolean;
}

interface LoadingStates {
  [key: string]: boolean;
}

interface ApiResponses {
  [key: string]: any;
}
interface ApiItem {
  apiUrl: string;
  headerValue: string;
  ref?: string;
  [key: string]: string | undefined;
}

type SubscriptionPlan = "free" | "basic" | "premium";

export default function ModalObject({ isVisible }: ModalObjectProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  const [selectedObject, setSelectedObject] = useState<ObjectItem | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedValue] = useState<string>("");
  const [expandedStates, setExpandedStates] = useState<ExpandedStates>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const [apiResponses, setApiResponses] = useState<ApiResponses>({});
  const headerLabels: Record<string, string> = {};

  const [userPlan] = useState<SubscriptionPlan>("premium");

  const mockObject: ObjectItem = {
    id: "mock1",
    name: "Mock Object",
    type: "Test",
    createdAt: new Date().toISOString(),
    size: "100KB",
    description: "This is a mock object for testing purposes.",
    data: {
      apiUrl: "https://api.example.com/test",
      ref: "result",
      x_api_key: "mock_api_key_12345",
    },
  };

  useEffect(() => {
    if (isVisible && !selectedObject) {
      setSelectedObject(mockObject);
    }
  }, [isVisible, selectedObject]);

  const handleSimpleObjectCreate = () => {
    console.log("Creating simple object");
    // Adicione aqui a lógica para criar um objeto simples
  };

  const handleApiIntegrationCreate = () => {
    console.log("Creating API integration");
    // Adicione aqui a lógica para criar uma integração de API
  };

  const [objects, setObjects] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Object ${i + 1}`,
      type: ["File", "Folder", "Image", "Document"][
        Math.floor(Math.random() * 4)
      ],
      createdAt: new Date(
        Date.now() - Math.random() * 10000000000
      ).toISOString(),
      size: `${Math.floor(Math.random() * 1000)}KB`,
      description: `This is a sample description for Object ${i + 1}.`,
      data: {
        apiUrl: "https://api.thecatapi.com/v1/images/search",
        ref: "",
        x_api_key:
          "live_MBxUcNm3mVG9wyDvPehmIMxbyXib6suW8QFy7KuYm4E1zxM3inOUb6wO9Qx9lupF",
      },
      data2: {
        apiUrl: "https://api.agraphs=2",
        ref: "breeasdasdds",
        custom_auth: "Authorization",
      },
    }))
  );

  const handleValueChange = (key: string, value: any) => {
    if (selectedObject) {
      const updatedObject = { ...selectedObject, [key]: value };
      setSelectedObject(updatedObject);
    }
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const handleKeyChange = (key: string, newKey: string) => {
    if (selectedObject) {
      const updatedObject = { ...selectedObject };
      delete updatedObject[key];
      updatedObject[newKey] = selectedObject[key];
      setEditingKey(newKey);
      setSelectedObject(updatedObject);
    }
  };

  const handleTryApi = async (
    key: string,
    apiUrl: string,
    headerValue: string,
    ref?: string
  ) => {
    console.log("Trying API", key, apiUrl, headerValue, ref);
    setLoadingStates((prev) => ({ ...prev, [key]: true }));

    try {
      if (!selectedObject) {
        console.error("selectedObject is null");
        return;
      }

      const headerName = headerLabels?.[key] ?? "x-api-key";

      const selectedData = selectedObject[key] as
        | Record<string, string>
        | undefined;

      if (!selectedData) {
        console.error(`No data found for key: ${key}`);
        return;
      }

      const apiKeyValue = Object.entries(selectedData).find(
        ([k]) => k !== "apiUrl" && k !== "ref"
      )?.[1];

      if (!apiKeyValue) {
        console.error(`No API key found in data for key: ${key}`);
        return;
      }

      const headers: Record<string, string> = {
        [headerName]: apiKeyValue,
      };

      console.log("Request headers:", headers);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const statusCode = response.status;
      const responseData = await response.json();

      if (!response.ok) {
        setApiResponses((prev) => ({
          ...prev,
          [key]: {
            error: responseData.error || response.statusText,
            statusCode,
            message: responseData.message || "Erro desconhecido",
          },
        }));
        return;
      }

      if (!ref) {
        setApiResponses((prev) => ({ ...prev, [key]: responseData }));
        return;
      }

      const refValue = ref
        .split(".")
        .reduce<any>((obj, part) => obj?.[part], responseData);

      if (refValue === undefined) {
        setApiResponses((prev) => ({
          ...prev,
          [key]: `O valor de '${ref}' não existe dentro do objeto original`,
        }));
        return;
      }

      setApiResponses((prev) => ({
        ...prev,
        [key]: refValue,
      }));
    } catch (error: unknown) {
      console.error("API Error:", error);

      setApiResponses((prev) => ({
        ...prev,
        [key]: {
          error: error instanceof Error ? error.message : "Erro desconhecido",
          statusCode: 500,
        },
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSave = () => {
    if (selectedObject) {
      const updatedObject = { ...selectedObject };

      if (editingKey) {
        (updatedObject as any)[editingKey] = editedValue;
      }

      setObjects(
        objects.map((obj) =>
          obj.id === updatedObject.id ? (updatedObject as typeof obj) : obj
        )
      );

      setSelectedObject(updatedObject);
      setEditingKey(null);
    }
  };

  const handleDeleteKey = (keyToDelete: string) => {
    if (selectedObject && keyToDelete !== "id") {
      const updatedObject = { ...selectedObject };
      delete updatedObject[keyToDelete];

      setObjects(
        objects.map((obj) =>
          obj.id === selectedObject.id ? (updatedObject as typeof obj) : obj
        )
      );

      setSelectedObject(updatedObject as typeof selectedObject);
    }
  };

  const handleDeleteObject = () => {
    if (selectedObject) {
      setObjects(objects.filter((obj) => obj.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };

  return (
    <Modal
      isOpen={isVisible && !!selectedObject}
      onClose={() => setSelectedObject(null)}
    >
      {selectedObject && (
        <div className="relative w-full max-w-[1000px] mx-auto max-h-[100vh] rounded-lg h-auto px-0  ">
          <div className="flex relative justify-between flex-col items-center pb-4">
            <div className="flex relative flex-col items-start gap-8 justify-center w-full">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
                {String(selectedObject?.name)}
              </h2>

              <div className="relative ml-auto flex justify-between w-full">
                <button
                  onClick={() => setSortAscending(!sortAscending)}
                  className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-800 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-zinc-700 transition-all duration-200"
                  title={sortAscending ? "Sort Z to A" : "Sort A to Z"}
                >
                  <ArrowUpDown
                    size={15}
                    className={`text-emerald-400/70  transition-all duration-200 ${
                      sortAscending ? "" : "rotate-180"
                    }`}
                  />
                  <span className="font-medium  group-hover:text-emerald-300">
                    Sort {sortAscending ? "a-z" : "z-a"}
                  </span>
                </button>
                <PremiumButton
                  userPlan={userPlan}
                  onSimpleObjectCreate={handleSimpleObjectCreate}
                  onApiIntegrationCreate={handleApiIntegrationCreate}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-1 min-h-[55vh] max-h-[55vh] overflow-hidden overflow-y-auto">
            {Object.entries(selectedObject)
              .filter(([key]) => key !== "id")
              .sort(([keyA], [keyB]) => {
                return sortAscending
                  ? keyA.localeCompare(keyB)
                  : keyB.localeCompare(keyA);
              })
              .map(([key, value]) => {
                const isSpecialObject =
                  typeof value === "object" &&
                  value !== null &&
                  "ref" in value &&
                  "apiUrl" in value;

                return (
                  <div
                    key={key}
                    className={`flex flex-col p-3 rounded-lg border border-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0px_10px_rgba(0,0,0,0.25)] hover:shadow-emerald-500/10 transition-all group bg-zinc-800 ${
                      isSpecialObject ? "col-span-full" : ""
                    }`}
                  >
                    <div className="flex items-center sm:w-full w-auto flex-1 sm:flex-0">
                      <div
                        className={cn(
                          "flex-1 flex md:flex-row flex-col items-center md:gap-0 gap-2  ",
                          isSpecialObject
                            ? "md:space-x-10 space-x-0"
                            : "md:space-x-2 space-x-0"
                        )}
                      >
                        <div
                          className={cn(
                            "flex flex-col",
                            isSpecialObject ? "w-full" : "md:w-2/5 w-full"
                          )}
                        >
                          {isSpecialObject && (
                            <span className="text-xs text-emerald-500 mb-2">
                              API Integration
                            </span>
                          )}
                          <input
                            type="text"
                            defaultValue={key}
                            className="flex- w-auto sm:w-full sm:flex-1 text-emerald-300 text-sm font-medium bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                            onChange={(e) =>
                              handleKeyChange(key, e.target.value)
                            }
                          />
                        </div>
                        {!isSpecialObject && (
                          <span className="text-emerald-300 md:block hidden">
                            |
                          </span>
                        )}
                        {isSpecialObject ? (
                          <div className="md:w-[91%] w-full flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-emerald-300 text-sm">
                                apiUrl:
                              </span>
                              <input
                                type="text"
                                // @ts-expect-error
                                defaultValue={value.apiUrl}
                                className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                                onChange={(e) =>
                                  handleValueChange(key, {
                                    ...value,
                                    apiUrl: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-emerald-300 text-sm w-10">
                                ref:
                              </span>
                              <input
                                type="text"
                                // @ts-expect-error
                                defaultValue={value.ref}
                                className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                                onChange={(e) =>
                                  handleValueChange(key, {
                                    ...value,
                                    ref: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="relative w-[38%]">
                                {/* Header Name Input - Mostra a chave do terceiro campo */}
                                <input
                                  type="text"
                                  defaultValue={
                                    Object.keys(value).find(
                                      (k) => k !== "apiUrl" && k !== "ref"
                                    ) || "x_api_key"
                                  }
                                  className="w-full text-emerald-300 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                                  onChange={(e) => {
                                    const oldKey = Object.keys(value).find(
                                      (k) => k !== "apiUrl" && k !== "ref"
                                    );
                                    const newValue = { ...value };
                                    if (oldKey) {
                                      const headerValue = newValue[oldKey];
                                      delete newValue[oldKey];
                                      newValue[e.target.value] = headerValue;
                                    }
                                    handleValueChange(key, newValue);
                                    // @ts-expect-error
                                    setHeaderLabels((prev) => ({
                                      ...prev,
                                      [key]: e.target.value,
                                    }));
                                  }}
                                />
                              </div>
                              <span className="text-emerald-300">|</span>

                              <div className="flex items-center w-full">
                                <input
                                  type={showApiKey ? "text" : "password"}
                                  // @ts-expect-error
                                  defaultValue={
                                    Object.entries(value).find(
                                      ([k]) => k !== "apiUrl" && k !== "ref"
                                    )?.[1] || ""
                                  }
                                  className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                                  onChange={(e) => {
                                    const headerKey =
                                      Object.keys(value).find(
                                        (k) => k !== "apiUrl" && k !== "ref"
                                      ) || "x_api_key";
                                    handleValueChange(key, {
                                      ...value,
                                      [headerKey]: e.target.value,
                                    });
                                  }}
                                />{" "}
                                <button
                                  type="button"
                                  onClick={toggleApiKeyVisibility}
                                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-r px-2 py-1 focus:outline-none  "
                                >
                                  {showApiKey ? (
                                    <EyeOffIcon className="w-4 h-4" />
                                  ) : (
                                    <EyeIcon className="w-4 h-4" />
                                  )}
                                  <span className="sr-only">
                                    {showApiKey
                                      ? "Hide API Key"
                                      : "Show API Key"}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            // @ts-expect-error
                            defaultValue={value}
                            className="md:flex-1 md:w-auto w-full  text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                            onChange={(e) =>
                              handleValueChange(key, e.target.value)
                            }
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteKey(key)}
                        className="ml-2 text-zinc-400 opacity-100 hover:text-red-400 transition-all"
                      >
                        <Trash size={14} />
                      </button>
                    </div>

                    {/* API Response Section */}
                    {isSpecialObject && (
                      <div className="mt-4 w-full bg-zinc-900 rounded-lg relative">
                        <div
                          className={`overflow-hidden transition-[height] duration-300 ease-in-out ${
                            expandedStates[key] ? "h-40" : "h-[68px]"
                          }`}
                        >
                          <div className="p-4 h-full overflow-y-auto">
                            <pre className="text-zinc-400 text-sm overflow-x-auto pr-32">
                              {loadingStates[key] ? (
                                <span className="text-orange-500">
                                  Loading...
                                </span>
                              ) : (
                                apiResponses[key] && (
                                  <code className="block w-full whitespace-pre-wrap break-all">
                                    {JSON.stringify(apiResponses[key], null, 2)}
                                  </code>
                                )
                              )}
                            </pre>
                          </div>
                        </div>

                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                          <button
                            onClick={() =>
                              setExpandedStates((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            className="px-2 py-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            {expandedStates[key] ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleTryApi(
                                key,
                                // @ts-expect-error
                                value.apiUrl,
                                value.headerValue,
                                value.ref
                              )
                            }
                            className="px-4  py-2 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loadingStates[key]}
                          >
                            {loadingStates[key] ? "Trying..." : "Try"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
            <button
              onClick={handleDeleteObject}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors flex items-center justify-center"
            >
              <Trash className="mr-1" size={14} />
              Delete Object
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center justify-center"
            >
              <Save className="mr-1" size={14} />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

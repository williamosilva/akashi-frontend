"use client";

import { motion } from "framer-motion";

import { AuroraBackground } from "@/components/ui/Aurora-background";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  ArrowUpDown,
  Plus,
  Folder,
  Edit,
  Trash,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  EyeOffIcon,
  EyeIcon,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import PremiumButton from "@/components/ui/PremiumButton";

type SubscriptionPlan = "free" | "basic" | "premium"


interface ObjectItem {
  id: string;
  [key: string]: string;
}

export default function FormPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedObject, setSelectedObject] = useState<ObjectItem | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const [expandedStates, setExpandedStates] = useState({});
  const [headerLabels, setHeaderLabels] = useState({});

  const [loadingStates, setLoadingStates] = useState({});
  const [apiResponses, setApiResponses] = useState({});

  const [userPlan, setUserPlan] = useState<SubscriptionPlan>("premium")

  const handleSimpleObjectCreate = () => {
    console.log("Creating simple object")
    // Adicione aqui a lógica para criar um objeto simples
  }

  const handleApiIntegrationCreate = () => {
    console.log("Creating API integration")
    // Adicione aqui a lógica para criar uma integração de API
  }

  const handlePlanChange = (newPlan: SubscriptionPlan) => {
    setUserPlan(newPlan)
    console.log(`Changed plan to: ${newPlan}`)
    // Adicione aqui qualquer lógica adicional para mudança de plano
  }


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

  const [showApiKey, setShowApiKey] = useState(false);

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  const handleTryApi = async (key, apiUrl, headerValue, ref) => {
    console.log("Trying API", key, apiUrl, headerValue, ref);
    setLoadingStates((prev) => ({ ...prev, [key]: true }));

    try {
      // Get the custom header name from headerLabels or default to x_api_key
      const headerName = headerLabels[key] || "x-api-key"; // Changed to x-api-key to match API expectation

      // Get the API key value from the selected object
      const selectedData = selectedObject[key];
      const apiKeyValue = Object.entries(selectedData).find(
        ([k]) => k !== "apiUrl" && k !== "ref"
      )?.[1];

      // Create headers object with the dynamic header name and API key value
      const headers = {
        [headerName]: apiKeyValue,
      };

      console.log("Request headers:", headers); // Para debug

      const response = await fetch(apiUrl, {
        method: "GET",
        headers,
      });

      // Log the response status and headers for debugging
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
            message: responseData.message, // Incluindo possível mensagem de erro da API
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
        .reduce((obj, part) => obj?.[part], responseData);

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
    } catch (error) {
      console.error("API Error:", error); // Para debug
      setApiResponses((prev) => ({
        ...prev,
        [key]: { error: error.message, statusCode: 500 },
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setObjects(
      [...objects].sort((a, b) =>
        newSortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
    );
  };

  const handleAdd = () => {
    const newObject: ObjectItem = {
      id: Date.now().toString(),
      name: `Object ${objects.length + 1}`,
      type: ["File", "Folder", "Image", "Document"][
        Math.floor(Math.random() * 4)
      ],
      createdAt: new Date().toISOString(),
      size: `${Math.floor(Math.random() * 1000)}KB`,
      asdas: `${Math.floor(Math.random() * 1000)}KB`,
      description: `This is a sample description for Object ${
        objects.length + 1
      }.`,
    };
    setObjects([...objects, newObject]);
  };

  const handleObjectClick = (object: ObjectItem) => {
    setSelectedObject(object);
  };

  const handleEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditedValue(value);
  };

  const handleSave = () => {
    if (selectedObject) {
      const updatedObject = { ...selectedObject };
      if (editingKey) {
        updatedObject[editingKey] = editedValue;
      }
      setObjects(
        objects.map((obj) =>
          obj.id === updatedObject.id ? updatedObject : obj
        )
      );
      setSelectedObject(updatedObject);
      setEditingKey(null);
    }
  };

  const handleDeleteKey = (key: string) => {
    if (selectedObject && key !== "id") {
      const { [key]: _, ...updatedObject } = selectedObject;
      setObjects(
        objects.map((obj) =>
          obj.id === updatedObject.id ? updatedObject : obj
        )
      );
      setSelectedObject(updatedObject);
    }
  };

  const handleDeleteObject = () => {
    if (selectedObject) {
      setObjects(objects.filter((obj) => obj.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="relative z-[2]">
        <AuroraBackground className="opacity-100">
          <div
            className={cn(
              "min-h-screen w-full text-zinc-100",
              montserrat.variable,
              jetbrainsMono.variable
            )}
          >
            <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
              <motion.h1
                className={cn(
                  "text-2xl font-semibold mb-6 text-start bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500",
                  montserrat.className
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Objects
              </motion.h1>

              <div className="flex justify-start space-x-4 mb-6">
                <motion.button
                  className="px-3 py-1 rounded-md bg-zinc-800 text-emerald-300 text-sm font-medium border border-emerald-500/20 hover:bg-zinc-700 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSort}
                >
                  <ArrowUpDown className="mr-1" size={14} />
                  Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </motion.button>
                <motion.button
                  className="px-3 py-1 rounded-md bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdd}
                >
                  <Plus className="mr-1" size={14} />
                  Add
                </motion.button>
              </div>

              <motion.div
                className="grid   grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4 overflow-y-auto "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {objects.map((object, index) => (
                  <motion.div
                    key={object.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "aspect-square p-3 rounded-lg bg-zinc-800/50 border border-emerald-500/20 hover:bg-zinc-700/50 transition-colors flex flex-col items-center justify-center cursor-pointer",
                      jetbrainsMono.className
                    )}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleObjectClick(object)}
                  >
                    <Folder className="text-emerald-400 mb-2" size={24} />
                    <span className="text-emerald-300/80 text-xs text-center truncate w-full">
                      {object.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </AuroraBackground>
      </div>

      <Modal isOpen={!!selectedObject} onClose={() => setSelectedObject(null)}>
        {selectedObject && (
          <div className="relative w-full max-w-[1000px] mx-auto max-h-[100vh] rounded-lg h-auto px-0 sm:px-6 ">
            <div className="flex relative justify-between flex-col items-center pb-4">
              <div className="flex relative flex-col items-start gap-8 justify-center w-full">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
                  {selectedObject.name}
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
                                      setHeaderLabels((prev) => ({
                                        ...prev,
                                        [key]: e.target.value,
                                      }));
                                    }}
                                  />
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="w-3 h-3 text-emerald-300 absolute left-[95%] top-[12%] transform -translate-y-1/2 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          Define o nome do header usado para a
                                          API
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <span className="text-emerald-300">|</span>
                                {/* Header Value Input - Mostra o valor do terceiro campo */}
                                <div className="flex items-center w-full">
                                  <input
                                    type={showApiKey ? "text" : "password"}
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
                                      {JSON.stringify(
                                        apiResponses[key],
                                        null,
                                        2
                                      )}
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
                                  value.apiUrl,
                                  value.headerValue,
                                  value.ref
                                )
                              }
                              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
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
    </main>
  );
}

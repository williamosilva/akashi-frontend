"use client";

import { motion } from "framer-motion";

import { AuroraBackground } from "@/components/ui/Aurora-background";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";
import {
  ArrowUpDown,
  Plus,
  Folder,
  Edit,
  Trash,
  Save,
  X,
  ChevronDown,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface ObjectItem {
  id: string;
  [key: string]: string;
}

export default function FormPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  const [objects, setObjects] = useState<ObjectItem[]>(
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
      asdas: `${Math.floor(Math.random() * 1000)}KB`,
      dcc: `${Math.floor(Math.random() * 1000)}KB`,
      asdasdasdas: `${Math.floor(Math.random() * 1000)}KB`,
      asasdasdas: `${Math.floor(Math.random() * 1000)}KB`,
      asffdas: `${Math.floor(Math.random() * 1000)}KB`,
      bb: `${Math.floor(Math.random() * 1000)}KB`,
      nn: `${Math.floor(Math.random() * 1000)}KB`,
    }))
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedObject, setSelectedObject] = useState<ObjectItem | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

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
                className="grid   grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4 overflow-y-auto flex-grow"
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
          <div className="w-full relative max-w-[1200px] mx-auto max-h-[80vh] overflow-y-auto rounded-lg">
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
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-3 py-2 rounded-lg bg-zinc-800 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-zinc-700 transition-all flex items-center"
                  >
                    <Plus size={14} className="mr-1" />
                    Create Object
                    <ChevronDown
                      size={14}
                      className={`ml-1 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 py-1 bg-zinc-800 border border-emerald-500/20 rounded-lg shadow-lg transform origin-top transition-all duration-200 ease-out">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                        onClick={() => {
                          // Handle simple object creation
                          setDropdownOpen(false);
                        }}
                      >
                        Create Simple Object
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                        onClick={() => {
                          // Handle API integration
                          setDropdownOpen(false);
                        }}
                      >
                        Create API Integration
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-1 max-h-96 overflow-hidden overflow-y-auto">
              {Object.entries(selectedObject)
                .filter(([key]) => key !== "id")
                .sort(([keyA], [keyB]) => {
                  return sortAscending
                    ? keyA.localeCompare(keyB)
                    : keyB.localeCompare(keyA);
                })
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center p-3 rounded-lg border border-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0px_10px_rgba(0,0,0,0.25)] hover:shadow-emerald-500/10 transition-all group bg-zinc-800"
                  >
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        defaultValue={key}
                        className="w-2/5 text-emerald-300 text-sm font-medium bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                        onChange={(e) => handleKeyChange(key, e.target.value)}
                      />
                      <span className="text-emerald-300">:</span>
                      <input
                        type="text"
                        defaultValue={value}
                        className="flex-1 text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
                        onChange={(e) => handleValueChange(key, e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteKey(key)}
                      className="ml-2 text-zinc-400 opacity-100 hover:text-red-400 transition-all"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
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

"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { ObjectHeader } from "./Object-modal-content/ObjectHeader";
import { ObjectProperties } from "./Object-modal-content/ObjectProperties";
import { ObjectActions } from "./Object-modal-content/ObjectActions";
import type { ModalObjectProps, ObjectItem, SubscriptionPlan } from "@/types";

export default function ModalObject({ isVisible }: ModalObjectProps) {
  const [selectedObject, setSelectedObject] = useState<ObjectItem | null>(null);
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [userPlan] = useState<SubscriptionPlan>("premium");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    if (isVisible && !selectedObject) {
      // Initialize with mock data or fetch from API
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
      setSelectedObject(mockObject);
    }
  }, [isVisible, selectedObject]);

  const handleSave = (updatedObject: ObjectItem) => {
    setObjects(
      objects.map((obj) => (obj.id === updatedObject.id ? updatedObject : obj))
    );
    setSelectedObject(updatedObject);
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
        <div className="relative w-full max-w-[1000px] mx-auto max-h-[100vh] rounded-lg h-auto px-0">
          <ObjectHeader
            // @ts-expect-error: Should expect string
            name={selectedObject.name}
            sortAscending={sortAscending}
            setSortAscending={setSortAscending}
            userPlan={userPlan}
          />
          <ObjectProperties
            object={selectedObject}
            sortAscending={sortAscending}
            onObjectUpdate={setSelectedObject}
          />
          <ObjectActions
            onSave={() => handleSave(selectedObject)}
            onDelete={handleDeleteObject}
          />
        </div>
      )}
    </Modal>
  );
}
